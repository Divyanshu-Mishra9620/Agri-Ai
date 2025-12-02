"""
Enhanced Web Search Integration for Agricultural Bot
Learns from web and provides real-time data for agriculture
"""

import os
import aiohttp
import asyncio
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json
from functools import lru_cache

class EnhancedWebSearch:
    """
    Multi-source web search integration for agricultural data
    Supports multiple search APIs with fallbacks
    """
    
    def __init__(self):
        # API Keys
        self.serpapi_key = os.getenv("SERPAPI_API_KEY")
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        self.google_cse_id = os.getenv("GOOGLE_CSE_ID")
        
        # Cache
        self.search_cache = {}
        self.cache_ttl = 86400  # 24 hours
        
        # Trusted agricultural sources
        self.trusted_sources = [
            "icar.org.in",
            "krishi.iitk.ac.in",
            "indiastat.com",
            "pib.gov.in",
            "farmer.gov.in",
            "niti.gov.in",
            "dac.gov.in",
            "agritech.tnau.ac.in",
            "agrostar.in",
            "kisankerala.gov.in"
        ]
        
        # Search categories
        self.search_categories = {
            "disease": {
                "queries": [
                    "{} crop disease symptoms treatment",
                    "{} plant disease management latest",
                    "{} fungal disease control methods"
                ]
            },
            "pest": {
                "queries": [
                    "{} pest management organic methods",
                    "{} insect pest control solutions",
                    "{} integrated pest management {}"
                ]
            },
            "fertilizer": {
                "queries": [
                    "{} crop fertilizer recommendation",
                    "{} soil nutrient management",
                    "{} organic fertilizer alternatives"
                ]
            },
            "weather": {
                "queries": [
                    "{} region weather advisory farming",
                    "{} seasonal weather impact crops",
                    "{} monsoon preparation {} state"
                ]
            },
            "market": {
                "queries": [
                    "{} crop market prices today",
                    "{} agricultural commodity prices",
                    "{} farm produce market rates"
                ]
            }
        }
    
    async def search_agricultural_data(
        self,
        query: str,
        category: str = "general",
        region: str = None,
        use_cache: bool = True
    ) -> Dict:
        """
        Main search function for agricultural data
        
        Args:
            query: Search query
            category: Type of query (disease, pest, fertilizer, weather, market)
            region: Geographic region for localized results
            use_cache: Use cached results if available
        
        Returns:
            Dictionary with search results and sources
        """
        
        # Check cache
        cache_key = f"{query}_{category}_{region}"
        if use_cache and cache_key in self.search_cache:
            cached_data = self.search_cache[cache_key]
            if datetime.now() - cached_data["timestamp"] < timedelta(hours=24):
                return cached_data["data"]
        
        # Build search queries
        search_queries = self._build_search_queries(query, category, region)
        
        # Perform searches
        results = {
            "query": query,
            "category": category,
            "region": region,
            "timestamp": datetime.now().isoformat(),
            "sources": [],
            "summary": "",
            "recommendations": []
        }
        
        # Try multiple search methods
        try:
            # Primary: SerpAPI (Google Search)
            serpapi_results = await self._search_serpapi(search_queries)
            results["sources"].extend(serpapi_results)
        except Exception as e:
            print(f"SerpAPI error: {e}")
        
        try:
            # Secondary: Google Custom Search
            if self.google_api_key and self.google_cse_id:
                gcs_results = await self._search_google_custom_search(search_queries)
                results["sources"].extend(gcs_results)
        except Exception as e:
            print(f"Google Custom Search error: {e}")
        
        # Filter by trusted sources
        results["sources"] = self._filter_trusted_sources(results["sources"])
        
        # Generate summary from results
        if results["sources"]:
            results["summary"] = self._generate_summary(results["sources"])
            results["recommendations"] = self._extract_recommendations(results["sources"])
        
        # Cache results
        self.search_cache[cache_key] = {
            "data": results,
            "timestamp": datetime.now()
        }
        
        return results
    
    async def _search_serpapi(self, queries: List[str]) -> List[Dict]:
        """Search using SerpAPI (Google Search)"""
        results = []
        
        if not self.serpapi_key:
            return results
        
        async with aiohttp.ClientSession() as session:
            for query in queries[:3]:  # Limit to 3 queries
                try:
                    params = {
                        "q": query,
                        "api_key": self.serpapi_key,
                        "num": 5,
                        "tbs": "qdr:w",  # Last week
                        "tbm": None  # All results
                    }
                    
                    async with session.get(
                        "https://serpapi.com/search",
                        params=params,
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            for item in data.get("organic_results", [])[:3]:
                                results.append({
                                    "title": item.get("title"),
                                    "url": item.get("link"),
                                    "snippet": item.get("snippet"),
                                    "position": item.get("position"),
                                    "source": "SerpAPI",
                                    "timestamp": datetime.now().isoformat(),
                                    "relevance_score": 0.9
                                })
                except asyncio.TimeoutError:
                    print(f"SerpAPI timeout for query: {query}")
                except Exception as e:
                    print(f"SerpAPI error for query {query}: {e}")
        
        return results
    
    async def _search_google_custom_search(self, queries: List[str]) -> List[Dict]:
        """Search using Google Custom Search API"""
        results = []
        
        if not (self.google_api_key and self.google_cse_id):
            return results
        
        async with aiohttp.ClientSession() as session:
            for query in queries[:2]:  # Limit to 2 queries
                try:
                    params = {
                        "q": query,
                        "key": self.google_api_key,
                        "cx": self.google_cse_id,
                        "num": 5
                    }
                    
                    async with session.get(
                        "https://www.googleapis.com/customsearch/v1",
                        params=params,
                        timeout=aiohttp.ClientTimeout(total=10)
                    ) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            for item in data.get("items", [])[:3]:
                                results.append({
                                    "title": item.get("title"),
                                    "url": item.get("link"),
                                    "snippet": item.get("snippet"),
                                    "source": "Google Custom Search",
                                    "timestamp": datetime.now().isoformat(),
                                    "relevance_score": 0.85
                                })
                except asyncio.TimeoutError:
                    print(f"GCS timeout for query: {query}")
                except Exception as e:
                    print(f"GCS error for query {query}: {e}")
        
        return results
    
    def _build_search_queries(
        self,
        query: str,
        category: str = "general",
        region: str = None
    ) -> List[str]:
        """Build multiple search queries for better coverage"""
        queries = [query]  # Original query
        
        # Add category-specific queries
        if category in self.search_categories:
            for q_template in self.search_categories[category]["queries"]:
                if region:
                    formatted_query = q_template.format(query, region)
                else:
                    formatted_query = q_template.format(query)
                queries.append(formatted_query)
        
        # Add region-specific queries
        if region:
            queries.extend([
                f"{query} {region} farming",
                f"{query} {region} agriculture department",
                f"{query} India {region}"
            ])
        
        # Add year/freshness to queries
        current_year = datetime.now().year
        queries.extend([
            f"{query} {current_year}",
            f"{query} latest research",
            f"{query} 2024 farming guide"
        ])
        
        return queries
    
    def _filter_trusted_sources(self, results: List[Dict]) -> List[Dict]:
        """Filter and prioritize trusted agricultural sources"""
        trusted = []
        general = []
        
        for result in results:
            url = result.get("url", "").lower()
            
            # Check if from trusted source
            is_trusted = any(source in url for source in self.trusted_sources)
            
            if is_trusted:
                result["trust_score"] = 1.0
                trusted.append(result)
            else:
                result["trust_score"] = 0.7
                general.append(result)
        
        # Return trusted sources first, then general
        return trusted + general
    
    def _generate_summary(self, sources: List[Dict]) -> str:
        """Generate summary from search results"""
        if not sources:
            return ""
        
        snippets = [s.get("snippet", "") for s in sources[:3] if s.get("snippet")]
        
        # Simple summary: combine top snippets
        summary = " ".join(snippets)
        
        # Limit length
        if len(summary) > 500:
            summary = summary[:500] + "..."
        
        return summary
    
    def _extract_recommendations(self, sources: List[Dict]) -> List[Dict]:
        """Extract actionable recommendations from sources"""
        recommendations = []
        
        for source in sources[:3]:
            snippet = source.get("snippet", "")
            
            # Simple extraction of recommendations
            if snippet:
                recommendations.append({
                    "text": snippet[:200],
                    "source": source.get("title"),
                    "url": source.get("url"),
                    "confidence": source.get("relevance_score", 0.8)
                })
        
        return recommendations
    
    @lru_cache(maxsize=128)
    async def get_region_specific_data(self, region: str, data_type: str) -> Dict:
        """Get region-specific agricultural data"""
        
        if data_type == "weather":
            return await self._fetch_weather_data(region)
        elif data_type == "market":
            return await self._fetch_market_prices(region)
        elif data_type == "diseases":
            return await self._fetch_regional_diseases(region)
        
        return {}
    
    async def _fetch_weather_data(self, region: str) -> Dict:
        """Fetch weather data for region"""
        try:
            # Try OpenWeatherMap or similar
            query = f"{region} weather forecast agriculture"
            results = await self.search_agricultural_data(query, "weather", region)
            return results
        except Exception as e:
            print(f"Weather fetch error: {e}")
            return {}
    
    async def _fetch_market_prices(self, region: str) -> Dict:
        """Fetch market prices for region"""
        try:
            query = f"{region} agricultural commodity market prices"
            results = await self.search_agricultural_data(query, "market", region)
            return results
        except Exception as e:
            print(f"Market price fetch error: {e}")
            return {}
    
    async def _fetch_regional_diseases(self, region: str) -> Dict:
        """Fetch common diseases in region"""
        try:
            query = f"{region} common crop diseases current season"
            results = await self.search_agricultural_data(query, "disease", region)
            return results
        except Exception as e:
            print(f"Regional diseases fetch error: {e}")
            return {}
    
    def clear_cache(self):
        """Clear search cache"""
        self.search_cache.clear()
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            "total_cached_queries": len(self.search_cache),
            "cache_size_mb": len(str(self.search_cache)) / 1024 / 1024
        }


# Example usage
async def main():
    """Example usage of enhanced web search"""
    
    search = EnhancedWebSearch()
    
    # Search for disease information
    results = await search.search_agricultural_data(
        query="rice leaf blast",
        category="disease",
        region="Punjab"
    )
    
    print(f"Found {len(results['sources'])} sources")
    print(f"Summary: {results['summary']}")
    print(f"Recommendations: {json.dumps(results['recommendations'], indent=2)}")


if __name__ == "__main__":
    asyncio.run(main())

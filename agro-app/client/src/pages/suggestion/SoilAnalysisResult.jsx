import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Eye,
  Droplets,
  Bug,
  TrendingUp,
} from "lucide-react";

const SoilAnalysisResult = ({ soilResult }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Memoize the parsing to prevent unnecessary re-calculations
  const analysis = useMemo(() => {
    if (!soilResult?.summary) {
      return {
        rating: null,
        soilCondition: "No soil condition data available",
        nutrientDeficiency: "No nutrient analysis available",
        pestDisease: "No pest/disease data available",
        recommendations: "",
        visualSummary: "No data available",
        nutrientSummary: "No data available",
        pestSummary: "No data available",
      };
    }

    const content = soilResult.summary;

    // Extract health rating
    const ratingMatch = content.match(
      /Overall\s+Health\s+Rating:?\*{0,2}\s*(\d+)\s*\/\s*10/i
    );
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : null;

    // Extract main sections
    const soilConditionMatch = content.match(
      /\*{0,2}1\.\s*Soil\s+Condition\s+Assessment:?\*{0,2}(.*?)(?=\*{0,2}2\.|$)/is
    );
    const nutrientMatch = content.match(
      /\*{0,2}2\.\s*Nutrient\s+Deficiency\s+Signs?:?\*{0,2}(.*?)(?=\*{0,2}3\.|$)/is
    );
    const pestMatch = content.match(
      /\*{0,2}3\.\s*Pest\s+or\s+Disease\s+Indicators?:?\*{0,2}(.*?)(?=\*{0,2}4\.|$)/is
    );
    const recommendationsMatch = content.match(
      /\*{0,2}4\.\s*Specific\s+Recommendations?.*?\*{0,2}(.*?)(?=\*{0,2}5\.|$)/is
    );

    // Generate summary messages based on analysis content
    const generateVisualSummary = (soilText) => {
      if (!soilText) return "No visual assessment available";
      const lowerText = soilText?.toLowerCase();
      if (
        lowerText.includes("dark") ||
        lowerText.includes("healthy") ||
        lowerText.includes("good")
      ) {
        return "The soil appears to be dark and healthy";
      } else if (
        lowerText.includes("light") ||
        lowerText.includes("poor") ||
        lowerText.includes("dry")
      ) {
        return "The soil appears light and may need attention";
      }
      return "Visual assessment completed";
    };

    const generateNutrientSummary = (nutrientText) => {
      if (!nutrientText) return "No nutrient analysis available";
      const lowerText = nutrientText?.toLowerCase();
      if (
        lowerText.includes("no signs") ||
        lowerText.includes("no clear") ||
        lowerText.includes("adequate")
      ) {
        return "No clear signs of major nutrient deficiency";
      } else if (
        lowerText.includes("deficiency") ||
        lowerText.includes("lacking") ||
        lowerText.includes("low")
      ) {
        return "Some nutrient deficiencies detected";
      }
      return "Nutrient analysis completed";
    };

    const generatePestSummary = (pestText) => {
      if (!pestText) return "No pest analysis available";
      const lowerText = pestText?.toLowerCase();
      if (
        lowerText.includes("no obvious") ||
        lowerText.includes("no signs") ||
        lowerText.includes("no pest") ||
        lowerText.includes("healthy")
      ) {
        return "No obvious pest or disease symptoms";
      } else if (
        lowerText.includes("pest") ||
        lowerText.includes("disease") ||
        lowerText.includes("damage")
      ) {
        return "Potential pest or disease issues detected";
      }
      return "Pest and disease assessment completed";
    };

    const soilCondition = soilConditionMatch
      ? soilConditionMatch[1].trim()
      : "No soil condition data available";
    const nutrientDeficiency = nutrientMatch
      ? nutrientMatch[1].trim()
      : "No nutrient analysis available";
    const pestDisease = pestMatch
      ? pestMatch[1].trim()
      : "No pest/disease data available";

    return {
      rating,
      soilCondition,
      nutrientDeficiency,
      pestDisease,
      recommendations: recommendationsMatch
        ? recommendationsMatch[1].trim()
        : "",
      visualSummary: generateVisualSummary(soilCondition),
      nutrientSummary: generateNutrientSummary(nutrientDeficiency),
      pestSummary: generatePestSummary(pestDisease),
    };
  }, [soilResult?.summary]);

  const recommendations = useMemo(() => {
    if (!analysis.recommendations) return [];

    const recommendations = [];
    const lines = analysis.recommendations
      .split("\n")
      .filter((line) => line.trim());

    let currentRec = null;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.match(/^\*{2,3}.*?:?\*{0,2}$/) || trimmed.match(/^\d+\.\s/)) {
        if (currentRec) recommendations.push(currentRec);
        currentRec = {
          title: trimmed
            .replace(/\*{2,3}/g, "")
            .replace(/^(\d+\.\s)?/, "")
            .replace(":*", "")
            .trim(),
          content: [],
        };
      } else if (currentRec && trimmed && !trimmed.startsWith("*")) {
        currentRec.content.push(trimmed.replace(/^\*\s*/, ""));
      }
    });

    if (currentRec) recommendations.push(currentRec);
    return recommendations;
  }, [analysis.recommendations]);

  const getRatingColor = (rating) => {
    if (!rating) return "text-gray-600 bg-gray-100";
    if (rating >= 8) return "text-green-600 bg-green-100";
    if (rating >= 6) return "text-yellow-600 bg-yellow-100";
    if (rating >= 4) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getRatingIcon = (rating) => {
    if (!rating) return <AlertTriangle className="w-5 h-5" />;
    if (rating >= 8) return <CheckCircle className="w-5 h-5" />;
    if (rating >= 6) return <AlertTriangle className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  // Handle missing soilResult
  if (!soilResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No soil analysis data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header with Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            Soil Analysis Results
          </h3>
        </div>

        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${getRatingColor(
            analysis.rating
          )}`}
        >
          {getRatingIcon(analysis.rating)}
          <span className="font-semibold">
            {analysis.rating ? `${analysis.rating}/10` : "N/A"}
          </span>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1  gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Visual Assessment</span>
          </div>
          <p className="text-sm text-blue-700">{analysis.visualSummary}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Nutrients</span>
          </div>
          <p className="text-sm text-green-700">{analysis.nutrientSummary}</p>
        </div>

        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="w-4 h-4 text-amber-600" />
            <span className="font-medium text-amber-800">Pest & Disease</span>
          </div>
          <p className="text-sm text-amber-700">{analysis.pestSummary}</p>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="space-y-4">
        {/* Soil Condition */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection("soil")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-expanded={expandedSections.soil}
            aria-controls="soil-content"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">
                Soil Condition Assessment
              </span>
            </div>
            {expandedSections.soil ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.soil && (
            <div id="soil-content" className="px-4 pb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {analysis.soilCondition}
              </p>
            </div>
          )}
        </div>

        {/* Nutrient Analysis */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection("nutrients")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
            aria-expanded={expandedSections.nutrients}
            aria-controls="nutrients-content"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Droplets className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-semibold text-gray-800">
                Nutrient Deficiency Analysis
              </span>
            </div>
            {expandedSections.nutrients ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.nutrients && (
            <div id="nutrients-content" className="px-4 pb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {analysis.nutrientDeficiency}
              </p>
            </div>
          )}
        </div>

        {/* Pest & Disease */}
        <div className="border rounded-lg">
          <button
            onClick={() => toggleSection("pests")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-inset"
            aria-expanded={expandedSections.pests}
            aria-controls="pests-content"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Bug className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-semibold text-gray-800">
                Pest & Disease Indicators
              </span>
            </div>
            {expandedSections.pests ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {expandedSections.pests && (
            <div id="pests-content" className="px-4 pb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {analysis.pestDisease}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-emerald-800">
              Action Recommendations
            </h4>
          </div>

          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm border border-emerald-200"
              >
                <h5 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  {rec.title}
                </h5>
                <div className="text-gray-700 text-sm space-y-1">
                  {rec.content.map((item, idx) => (
                    <p
                      key={idx}
                      className="leading-relaxed whitespace-pre-line"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Score */}
      {soilResult.confidence && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-medium">
              Analysis Confidence
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      Math.max(soilResult.confidence, 0),
                      100
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-gray-600">
                {soilResult.confidence}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysisResult;

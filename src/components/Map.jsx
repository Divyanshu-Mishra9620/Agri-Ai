import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Loader2, MapPin, RotateCcw, Search } from "lucide-react";

export const Map = ({ onDistrictSelect, searchRequest }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [infoText, setInfoText] = useState(
    "Click on any district to view agricultural information"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const svgRef = useRef();
  const geoDataRef = useRef();

  const getDistrictName = (props) => props?.district || props?.DISTRICT;
  const getStateName = (props) => props?.st_nm || props?.STATE;

  useEffect(() => {
    const width = 960;
    const height = 700;

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("background", "#f3f4f6");

    svg.selectAll("*").remove();

    const g = svg.append("g");
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 20])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const zoomToFeature = (feature, duration = 1000) => {
      const bounds = path.bounds(feature);
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = Math.max(
        1,
        Math.min(20, 0.8 / Math.max(dx / width, dy / height))
      );
      const translate = [width / 2 - scale * x, height / 2 - scale * y];

      svg
        .transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    };

    const zoomToBounds = (bounds, duration = 1000) => {
      const dx = bounds[1][0] - bounds[0][0];
      const dy = bounds[1][1] - bounds[0][1];
      const x = (bounds[0][0] + bounds[1][0]) / 2;
      const y = (bounds[0][1] + bounds[1][1]) / 2;
      const scale = Math.max(
        1,
        Math.min(20, 0.8 / Math.max(dx / width, dy / height))
      );
      const translate = [width / 2 - scale * x, height / 2 - scale * y];
      svg
        .transition()
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .call(
          zoom.transform,
          d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    };

    svgRef.current.d3 = {
      svg,
      g,
      path,
      zoom,
      projection,
      zoomToFeature,
      zoomToBounds,
    };

    const renderFeatures = (geojson) => {
      if (!geojson || !geojson.features) {
        setIsLoading(false);
        setInfoText("Failed to load map data: Invalid GeoJSON format.");
        return () => {};
      }

      const districtFeatures = geojson.features.filter((feature) =>
        getDistrictName(feature.properties)
      );

      if (districtFeatures.length === 0) {
        setIsLoading(false);
        setInfoText("Map data loaded, but no districts were found.");
        return () => {};
      }

      geoDataRef.current = districtFeatures;
      projection.fitSize([width, height], {
        type: "FeatureCollection",
        features: districtFeatures,
      });
      setIsLoading(false);

      d3.selectAll(".tooltip").remove();

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      g.selectAll(".district")
        .data(districtFeatures)
        .enter()
        .append("path")
        .attr("class", "district")
        .attr("d", path)
        .on("click", (event, d) => {
          event.stopPropagation();
          const districtName = getDistrictName(d.properties);
          const stateName = getStateName(d.properties);

          if (!districtName) return;

          if (
            selectedDistrict &&
            selectedDistrict.district === districtName &&
            selectedDistrict.state === stateName
          ) {
            return;
          }

          g.selectAll(".district")
            .attr("fill", "#10b981")
            .attr("opacity", 0.6)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 0.6);

          g.selectAll(".district")
            .filter((f) => getStateName(f.properties) === stateName)
            .attr("opacity", 0.9);

          d3.select(event.currentTarget)
            .attr("fill", "#059669")
            .attr("opacity", 1)
            .attr("stroke", "#065f46")
            .attr("stroke-width", 2);

          const selectedProps = { district: districtName, state: stateName };
          setSelectedDistrict(selectedProps);
          setInfoText(`Selected: ${districtName}, ${stateName}`);
          onDistrictSelect(selectedProps);

          const stateDistricts = geoDataRef.current.filter(
            (f) => getStateName(f.properties) === stateName
          );
          if (stateDistricts && stateDistricts.length > 0) {
            const initial = path.bounds(stateDistricts[0]);
            const combined = stateDistricts.reduce((acc, feat) => {
              const b = path.bounds(feat);
              return [
                [Math.min(acc[0][0], b[0][0]), Math.min(acc[0][1], b[0][1])],
                [Math.max(acc[1][0], b[1][0]), Math.max(acc[1][1], b[1][1])],
              ];
            }, initial);
            svgRef.current.d3.zoomToBounds(combined);
          } else {
            zoomToFeature(d);
          }
        })
        .on("mouseover", function (event, d) {
          const currentDistrictName = getDistrictName(selectedDistrict);
          const hoveredDistrictName = getDistrictName(d.properties);

          if (currentDistrictName !== hoveredDistrictName) {
            d3.select(this).attr("fill", "#059669");
          }

          const stateName = getStateName(d.properties);
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip
            .html(`<strong>${hoveredDistrictName}</strong><br/>${stateName}`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function (event, d) {
          const currentDistrictName = getDistrictName(selectedDistrict);
          const hoveredDistrictName = getDistrictName(d.properties);

          if (currentDistrictName !== hoveredDistrictName) {
            d3.select(this).attr("fill", "#10b981");
          }
          tooltip.transition().duration(500).style("opacity", 0);
        });

      return () => tooltip.remove();
    };

    d3.json("/india.geojson")
      .then(renderFeatures)
      .catch((error) => {
        console.warn(
          "Failed to load india.geojson:",
          error,
          "Falling back to india.json"
        );
        return d3.json("/india.json").then(renderFeatures);
      })
      .catch((error) => {
        console.error("Failed to load map data from all sources:", error);
        setIsLoading(false);
        setInfoText("Failed to load map data.");
      });
  }, [onDistrictSelect]);

  const handleSearch = useCallback(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query || !geoDataRef.current) return;

    const { g, zoomToFeature } = svgRef.current.d3;
    const district = geoDataRef.current.find(
      (f) => getDistrictName(f.properties)?.toLowerCase() === query
    );

    if (district) {
      const districtName = getDistrictName(district.properties);
      const stateName = getStateName(district.properties);
      const selectedProps = { district: districtName, state: stateName };

      setInfoText(`Found: ${districtName}, ${stateName}`);
      setSelectedDistrict(selectedProps);
      onDistrictSelect(selectedProps);

      g.selectAll(".district").attr("fill", (d) =>
        getDistrictName(d.properties)?.toLowerCase() === query
          ? "#059669"
          : "#10b981"
      );

      zoomToFeature(district);
    } else {
      setInfoText(`No results found for "${searchTerm}"`);
    }
  }, [searchTerm, onDistrictSelect]);

  const handleReset = () => {
    const { svg, zoom, g } = svgRef.current.d3;
    svg
      .transition()
      .duration(750)
      .ease(d3.easeCubicInOut)
      .call(zoom.transform, d3.zoomIdentity);

    setInfoText("Click on any district to view agricultural information");
    setSelectedDistrict(null);
    g.selectAll(".district").attr("fill", "#10b981");
  };

  useEffect(() => {
    if (!searchRequest || !geoDataRef.current) return;
    const query = String(searchRequest).toLowerCase().trim();
    if (!query) return;

    const d3ctx = svgRef.current?.d3;
    if (!d3ctx) return;

    const { g, zoomToBounds } = d3ctx;

    const match = geoDataRef.current.find(
      (f) => getDistrictName(f.properties)?.toLowerCase() === query
    );

    if (!match) return;

    const districtName = getDistrictName(match.properties);
    const stateName = getStateName(match.properties);

    if (
      selectedDistrict &&
      selectedDistrict.district === districtName &&
      selectedDistrict.state === stateName
    ) {
      return;
    }

    setSearchTerm(searchRequest);
    const selectedProps = { district: districtName, state: stateName };
    setSelectedDistrict(selectedProps);
    setInfoText(`Found: ${districtName}, ${stateName}`);

    g.selectAll(".district")
      .attr("fill", "#10b981")
      .attr("opacity", 0.6)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 0.6);

    g.selectAll(".district")
      .filter((f) => getStateName(f.properties) === stateName)
      .attr("opacity", 0.9);

    g.selectAll(".district")
      .filter((f) => getDistrictName(f.properties) === districtName)
      .attr("fill", "#059669")
      .attr("opacity", 1)
      .attr("stroke", "#065f46")
      .attr("stroke-width", 2);

    const stateDistricts = geoDataRef.current.filter(
      (f) => getStateName(f.properties) === stateName
    );
    if (stateDistricts && stateDistricts.length > 0) {
      const initial = d3ctx.path.bounds(stateDistricts[0]);
      const combined = stateDistricts.reduce((acc, feat) => {
        const b = d3ctx.path.bounds(feat);
        return [
          [Math.min(acc[0][0], b[0][0]), Math.min(acc[0][1], b[0][1])],
          [Math.max(acc[1][0], b[1][0]), Math.max(acc[1][1], b[1][1])],
        ];
      }, initial);
      zoomToBounds(combined);
    }
  }, [searchRequest, selectedDistrict]);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <h1 className="text-3xl font-bold flex items-center space-x-3 mb-4">
          <MapPin className="w-8 h-8" />
          <span>Agricultural District Map of India</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-200 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search by district name..."
              className="w-full pl-10 pr-4 py-3 bg-white/20 text-white placeholder-green-100 rounded-lg focus:ring-2 focus:ring-white/50 outline-none transition"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-green-50 transition shadow"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-green-800 text-white font-semibold rounded-lg hover:bg-green-900 transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-t">
        <p className="font-medium text-center text-amber-800">{infoText}</p>
      </div>

      <div className="relative flex-grow bg-gray-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-700">
                Loading agricultural map...
              </p>
            </div>
          </div>
        )}
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>

      <style jsx global>{`
        .district {
          fill: #10b981;
          stroke: #ffffff;
          stroke-width: 0.6px;
          cursor: pointer;
          transition: fill 0.2s ease-in-out;
        }
        .tooltip {
          position: absolute;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px;
          border-radius: 6px;
          font-size: 12px;
          pointer-events: none;
          transition: opacity 0.2s;
        }
      `}</style>
    </div>
  );
};

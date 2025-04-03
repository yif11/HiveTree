import { type GeoPermissibleObjects, geoContains } from "d3-geo";
import { scaleLinear } from "d3-scale";
import type { Feature } from "geojson";
import type React from "react";
import { useEffect, useState } from "react";
import { SavedIPEntry, getSavedIPs } from "../api/api";
import { getPrefectureSentiment } from "../api/api";

import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";

const geoUrl = "/japan.topojson";

const colorScale = scaleLinear<string>()
	.domain([-1, 0, 1])
	.range(["#ff3333", "#ffffff", "#3333ff"])
	.clamp(true);

export const MapPostArea: React.FC<{ topicId: string }> = ({ topicId }) => {
	const [prefectureScores, setPrefectureScores] = useState<
		Record<string, number>
	>({});
	const [geoFeatures, setGeoFeatures] = useState<
		Feature<GeoPermissibleObjects>[]
	>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(geoUrl);
			const data = await response.json();
			const features = feature(data, data.objects.japan)
				.features as Feature<GeoPermissibleObjects>[];
			setGeoFeatures(features);
			const sentimentData = await getPrefectureSentiment();
			//const topicSentiment=sentimentData[topicId]; // specify topic id
			const topicSentiment =
				sentimentData["f574dc8c-7604-43ed-9a1b-58d45554c9b3"]; // specify topic id

			if (topicSentiment) {
				const avgScores: Record<string, number> = {};
				for (const prefCode in topicSentiment) {
					const { positive, neutral, negative } = topicSentiment[prefCode];
					const total = positive + neutral + negative;
					const score = total === 0 ? 0 : (positive - negative) / total;
					avgScores[prefCode] = score;
					console.log(
						`\u90fd\u9053\u5e9c\u770c ${prefCode} \u306e\u30b9\u30b3\u30a2: ${score}`,
					);
				}
				setPrefectureScores(avgScores);
			}
		};

		fetchData();
	}, []);

	return (
		<ComposableMap
			projection="geoMercator"
			projectionConfig={{ scale: 1500, center: [137, 38] }}
		>
			<Geographies geography={geoUrl}>
				{({ geographies }) =>
					geographies.map((geo) => {
						const code = `JP-${String(geo.properties.id).padStart(2, "0")}`;
						const score = prefectureScores[code] ?? 0;
						return (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								fill={colorScale(score)}
								style={{
									default: { stroke: "#333", strokeWidth: 0.3 },
									hover: { fill: "#ffc107", stroke: "#333" },
									pressed: { fill: "#666" },
								}}
							/>
						);
					})
				}
			</Geographies>
		</ComposableMap>
	); //重複するIPがあってもidxで区別
};

export default MapPostArea;

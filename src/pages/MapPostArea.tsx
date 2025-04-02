import { type GeoPermissibleObjects, geoContains } from "d3-geo";
import { scaleLinear } from "d3-scale";
import type { Feature } from "geojson";
import type React from "react";
import { useEffect, useState } from "react";
import { SavedIPEntry, getSavedIPs } from "../api/api";

import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";
import { feature } from "topojson-client";

const geoUrl = "/japan.topojson";

const colorScale = scaleLinear<string>()
	.domain([-0.5, 0, 0.5])
	.range(["#ff3333", "#ffffff", "#3333ff"])
	.clamp(true);

type Post = {
	ip: string;
	coordinates: [number, number];
	score: number;
};

export const MapPostArea = () => {
	const [posts, setPosts] = useState<Post[]>([]);
	const [prefectureScores, setPrefectureScores] = useState<
		Record<string, number>
	>({});
	const [geoFeatures, setGeoFeatures] = useState<
		Feature<GeoPermissibleObjects>[]
	>([]);
	const [showMarkers] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(geoUrl);
			const data = await response.json();
			const features = feature(data, data.objects.japan)
				.features as Feature<GeoPermissibleObjects>[];
			setGeoFeatures(features);

			const ipData = await getSavedIPs(); // すでに緯度経度が入ってるやつを取得
			const results: Post[] = ipData
				.filter((entry) => entry.lat && entry.lon)
				.map((entry) => ({
					ip: entry.ip,
					coordinates: [entry.lon, entry.lat],
					score: Math.random() * 2 - 1, // ←仮のランダムスコア
				}));

			const prefScores: Record<string, number[]> = {};
			for (const post of results) {
				const matched = features.find((geo: Feature<GeoPermissibleObjects>) =>
					geoContains(geo, post.coordinates),
				);
				if (matched) {
					const prefCode = `JP-${String(matched.properties.id).padStart(2, "0")}`;
					if (!prefScores[prefCode]) {
						prefScores[prefCode] = [];
					}
					prefScores[prefCode].push(post.score);
				}
			}

			const avgScores: Record<string, number> = {};
			for (const code in prefScores) {
				const values = prefScores[code];
				avgScores[code] = values.reduce((a, b) => a + b, 0) / values.length;
				console.log(`都道府県 ${code} の平均スコア: ${avgScores[code]}`);
			}

			setPosts(results);
			setPrefectureScores(avgScores);
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
			{showMarkers &&
				posts.map((post, idx) => (
					<Marker key={`${post.ip}-${idx}`} coordinates={post.coordinates}>
						<circle
							r={5}
							fill={colorScale(post.score)}
							stroke="#fff"
							strokeWidth={1}
						/>
						<title>{post.ip}</title>
					</Marker>
				))}
		</ComposableMap>
	); //重複するIPがあってもidxで区別
};

export default MapPostArea;

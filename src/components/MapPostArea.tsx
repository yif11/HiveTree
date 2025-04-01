import { type GeoPermissibleObjects, geoContains } from "d3-geo";
import { scaleLinear } from "d3-scale";
import type { Feature } from "geojson";
import type React from "react";
import { useEffect, useState } from "react";

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
	const [showMarkers] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(geoUrl);
			const data = await response.json();
			const features = feature(data, data.objects.japan)
				.features as Feature<GeoPermissibleObjects>[];
			setGeoFeatures(features);

			const dummyIPs = [
				"113.38.224.0",
				"119.26.220.0",
				"58.13.134.0",
				"113.144.128.0",
				"210.132.144.0",
				"182.251.64.0",
				"113.149.154.0",
				"113.149.155.128",
				"114.181.128.0",
				"219.126.112.0",
				"118.241.58.0",
				"60.35.204.0",
				"106.163.137.0",
				"115.162.20.0",
				"160.86.79.64",
				"160.86.79.128",
				"182.171.124.0",
				"61.112.112.0",
				"180.38.112.0",
				"60.239.48.0",
				"103.95.104.0",
				"114.189.16.0",
				"153.246.111.0",
				"27.86.176.0",
				"60.62.184.0",
				"114.18.80.0",
				"114.189.32.0",
				"124.146.96.0",
				"106.150.88.0",
				"122.145.160.0",
				"14.9.35.0",
				"14.9.35.128",
				"14.9.36.0",
				"114.186.144.0",
				"118.7.204.0",
				"118.7.220.0",
				"153.145.136.0",
				"193.116.32.0",
				"153.144.208.0",
				"180.17.128.0",
				"59.128.148.0",
				"43.234.208.0",
				"36.8.172.0",
				"220.109.16.0",
				"153.238.130.0",
				"90.149.160.0",
				"90.149.208.0",
				"90.149.220.0",
				"90.149.221.0",
				"92.202.92.0",
				"92.203.255.0",
			];

			const results: Post[] = [];
			let ipcount = 0;

			for (const ip of dummyIPs) {
				try {
					const res = await fetch(`http://localhost:5000/api/geoip?ip=${ip}`);
					const data = await res.json();
					if (ipcount % 100 === 0) {
						console.log(`IP Count: ${ipcount}/${dummyIPs.length}`);
					}
					ipcount += 1;

					if (data.latitude && data.longitude) {
						results.push({
							ip,
							coordinates: [
								Number.parseFloat(data.longitude),
								Number.parseFloat(data.latitude),
							],
							score: Math.random() * 2 - 1,
						});
					}
				} catch (error) {
					console.error(`IP ${ip} の位置情報取得に失敗:`, error);
				}
			}

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
				posts.map((post) => (
					<Marker key={post.ip} coordinates={post.coordinates}>
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
	);
};

export default MapPostArea;

import type React from "react";
import { useEffect, useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";

const geoUrl = "/japan.topojson";

type Post = {
	ip: string;
	coordinates: [number, number];
};

const dummyIPs = [
	"182.251.64.0", // あきる野（関東地方）
	"114.157.0.0", // 万代町（四国地方）
	"182.171.124.0", // あま（中部地方）
	"124.241.16.0", // あわら市（中部地方）
	"153.246.111.0", // うきは（九州地方）
	"118.7.220.0", // つがる市（東北地方）
];

const MapPostArea: React.FC = () => {
	const [posts, setPosts] = useState<Post[]>([]);

	useEffect(() => {
		const fetchAllLocations = async () => {
			const ipList = [...dummyIPs];

			// 自分のIPも追加！これは後で消す
			try {
				const ipRes = await fetch("https://api.ipify.org?format=json");
				const ipData = await ipRes.json();
				ipList.push(ipData.ip);
			} catch (err) {
				console.warn("自分のIP取得に失敗:", err);
			}

			const results: Post[] = [];

			for (const ip of ipList) {
				try {
					const res = await fetch(`http://localhost:5000/api/geoip?ip=${ip}`);
					const data = await res.json();

					if (data.latitude && data.longitude) {
						results.push({
							ip,
							coordinates: [
								Number.parseFloat(data.longitude),
								Number.parseFloat(data.latitude),
							],
						});
					}
				} catch (err) {
					console.warn(`IP ${ip} の位置情報取得に失敗:`, err);
				}
			}

			setPosts(results);
		};

		fetchAllLocations();
	}, []);

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">投稿エリアマッピング</h2>
			<ComposableMap
				projection="geoMercator"
				projectionConfig={{ scale: 800, center: [137, 38] }}
			>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								style={{
									default: {
										fill: "#E0E0E0",
										stroke: "#FFFFFF",
										strokeWidth: 0.75,
									},
								}}
							/>
						))
					}
				</Geographies>

				{posts.map((post, idx) => (
					<Marker key={idx} coordinates={post.coordinates}>
						<circle
							r={6}
							fill={
								post.ip === posts[posts.length - 1].ip ? "#2196f3" : "#ff5722"
							}
							stroke="#fff"
							strokeWidth={2}
						/>
						<text
							textAnchor="middle"
							y={-10}
							style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 10 }}
						>
							{post.ip === posts[posts.length - 1].ip ? "You" : post.ip}
						</text>
					</Marker>
				))}
			</ComposableMap>
		</div>
	);
};

export default MapPostArea;

import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "/japan.topojson";

type Post = {
  ip: string;
  coordinates: [number, number];
};

const dummyIPs = [
  "113.38.224.0", //いぶき野（近畿地方）
  "119.26.220.0", // いぶき野（近畿地方）
  "58.13.134.0", // つつじが丘（近畿地方）
  "113.144.128.0", // つつじが丘（近畿地方）
  "210.132.144.0", // つつじが丘（近畿地方）
  "61.46.144.0", // はつが野（近畿地方）
  "61.46.152.0", // はつが野（近畿地方）
  "119.24.176.0", // はつが野（近畿地方）
  "182.169.12.0", // はつが野（近畿地方）

  "182.251.64.0", // あきる野（関東地方）
  "182.251.80.0", // あきる野（関東地方）
  "182.251.112.0", // あきる野（関東地方）

  "43.235.152.0", // あざみ野（関東地方）
  "59.129.208.0", // あざみ野（関東地方）
  "111.101.199.0", // あざみ野（関東地方）
  "113.149.154.0", // あざみ野（関東地方）
  "113.149.155.128", // あざみ野（関東地方）

  "39.110.26.0", // あすみが丘（関東地方）
  "39.111.74.0", // あすみが丘（関東地方）
  "59.136.22.0", // あすみが丘（関東地方）
  "59.136.24.0", // あすみが丘（関東地方）
  "114.181.128.0", // あすみが丘（関東地方）

  "114.157.0.0", // 万代町（四国地方）
  "114.171.16.0", // 万代町（四国地方）
  "150.59.16.0", // 万代町（四国地方）

  "60.35.204.0", // 中央町（四国地方）
  "106.163.137.0", // 中央町（四国地方）
  "115.162.20.0", // 中央町（四国地方）

  "160.86.79.64", // あま（中部地方）
  "160.86.79.128", // あま（中部地方）
  "182.171.124.0", // あま（中部地方）

  "124.241.16.0", // あわら市（中部地方）
  "124.241.64.0", // あわら市（中部地方）

  "106.136.182.0", // かほく市（中部地方）
  "119.18.176.0", // かほく市（中部地方）
  "202.213.96.0", // かほく市（中部地方）

  "14.13.50.128", // 一の宮町（中国地方）

  "60.239.48.0", // 三原市（中国地方）
  "103.95.104.0", // 三原市（中国地方）
  "114.189.16.0", // 三原市（中国地方）

  "211.12.226.0", // 三成（中国地方）
  "211.12.228.0", // 三成（中国地方）
  "211.12.233.0", // 三成（中国地方）

  "153.246.111.0", // うきは（九州地方）

  "27.86.176.0", // うるま市（九州地方）
  "58.94.60.0", // うるま市（九州地方）
  "111.107.16.0", // うるま市（九州地方）
  "111.107.56.0", // うるま市（九州地方）

  "14.9.35.0", // いわき市（東北地方）
  "14.9.35.128", // いわき市（東北地方）
  "14.9.36.0", // いわき市（東北地方）

  "114.186.144.0", // つがる市（東北地方）
  "118.7.204.0", // つがる市（東北地方）
  "118.7.220.0", // つがる市（東北地方）

  "180.17.128.0", // 中川（北海道地方）
	"59.128.148.0", //伊達市 (北海道地方)
	"43.234.208.0", //光陽町 (北海道地方)
	"36.8.172.0", //北広島 (北海道地方)
	"220.109.16.0", //札幌市(北海道地方)
	"153.238.130.0", //釧路市(北海道地方)
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
              coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
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
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 800, center: [137, 38] }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: "#E0E0E0", stroke: "#FFFFFF", strokeWidth: 0.75 },
                }}
              />
            ))
          }
        </Geographies>

        {posts.map((post, idx) => (
          <Marker key={idx} coordinates={post.coordinates}>
            <circle r={6} fill="#ff5722" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-10} style={{ fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 10 }}>
              {post.ip === posts[posts.length - 1].ip ? "You" : post.ip}
            </text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
};

export default MapPostArea;


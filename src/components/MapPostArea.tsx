import React, { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl = "/japan.topojson"; // ローカルの日本地図TopoJSON。地図はローカルに置いたやつを使ってる。

type Coordinates = [number, number];

const MapPostArea: React.FC = () => {
const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // IPアドレスを取得
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // IPから位置情報を取得
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();

        if (geoData && geoData.latitude && geoData.longitude) {
          setUserLocation([geoData.longitude, geoData.latitude]);
        }
      } catch (err) {
        console.error("IP位置情報の取得に失敗:", err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">投稿エリアマッピング</h2>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 1500, center: [137, 38] }}>
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

        {/* 取得できたらマーカーを表示 */}
        {userLocation && (
          <Marker coordinates={userLocation}>
            <circle r={6} fill="#ff5722" stroke="#fff" strokeWidth={2} />
            <text textAnchor="middle" y={-10} style={{ fontFamily: "system-ui", fill: "#5D5A6D" }}>
              Your IP
            </text>
          </Marker>
        )}
      </ComposableMap>
    </div>
  );
};

export default MapPostArea;

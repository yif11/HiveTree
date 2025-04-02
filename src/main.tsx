import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MapPostArea from "./pages/MapPostArea.tsx";
import App from "./App.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
		<MapPostArea />
	</StrictMode>,
);//MapPostAreaをテスト用に追加している。

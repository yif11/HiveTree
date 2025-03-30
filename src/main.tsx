import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Summary } from "./components/Summary.tsx";
import MapPostArea from "./components/MapPostArea.tsx";


// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Summary />
		<MapPostArea />
	</StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Summary } from "./components/Summary.tsx";
import LP from "./pages/LP.tsx"; // LP コンポーネントのパスを指定


// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* <Summary /> */}
		<LP />
	</StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { TopicList } from "./pages/TopicList.tsx";
// import { Summary } from "./pages/Summary.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		{/* <Summary /> */}
		<TopicList />
	</StrictMode>,
);

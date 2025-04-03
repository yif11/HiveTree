import type React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LP from "./pages/LP.tsx"; // LP コンポーネントのパスを指定
import { Summary } from "./pages/Summary.tsx";
import { TopicList } from "./pages/TopicList.tsx";

const App: React.FC = () => {
	return (
		<Router>
			<div>
				{/* <nav>
					<ul>
						<li>
							<Link to="/" className="font-bold">
								・LP
							</Link>
						</li>
						<li>
							<Link to="/summary" className="font-bold">
								・Summary
							</Link>
						</li>
						<li>
							<Link to="/topic-list" className="font-bold">
								・TopicList
							</Link>
						</li>
					</ul>
				</nav> */}

				{/* ルーティングの設定 */}
				<Routes>
					<Route path="/" element={<LP />} />
					<Route path="/summary" element={<Summary />} />
					<Route path="/topic-list" element={<TopicList />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;

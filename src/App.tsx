import type React from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Summary } from "./components/Summary.tsx";
import LP from "./pages/LP.tsx"; // LP コンポーネントのパスを指定

const App: React.FC = () => {
	return (
		<Router>
			<div>
				<nav>
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
					</ul>
				</nav>

				{/* ルーティングの設定 */}
				<Routes>
					<Route path="/" element={<LP />} />
					<Route path="/summary" element={<Summary />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;

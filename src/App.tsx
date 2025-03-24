import { useState } from "react";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1 className="font-bold bg-sky-50">Title</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
			</div>
		</>
	);
}

export default App;

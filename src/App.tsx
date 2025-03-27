import { useEffect, useState } from "react";
import { fetchHello } from "./api/api"; // バックエンドAPIからメッセージを取得する関数をインポート

function App() {
	const [count, setCount] = useState(0);
	const [message, setMessage] = useState(""); //初期値は空文字
	//バックエンドからデータを取得
	useEffect(() => {
		fetchHello().then(setMessage);
	}, []); // 初回のみAPI呼び出し

	return (
		<>
			<h1 className="font-bold bg-sky-50">Title</h1>
			<div className="card">
				<button type="button" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>{message}</p>
			</div>
		</>
	);
}

export default App;

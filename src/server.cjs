//バックエンド
const express = require("express"); // Expressモジュールを読み込む
const app = express(); // Expressアプリケーションを作成
const port = 3000;

app.get("/api/hello", (req, res) => {
	res.send("Hello from backend");
});
// サーバー起動
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});

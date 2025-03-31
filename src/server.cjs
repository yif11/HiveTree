const express = require("express");
const fs = require("fs"); //ファイル操作用
const path = require("path");
const cors = require("cors"); //別のポートからのリクエストを許可するためのミドルウェア

const app = express();
app.use(express.json());
// app.use(cors()); //corsを許可
app.use(cors({ origin: "http://localhost:5173" }));

const commentsDir = path.join(__dirname, "data"); //現在のディレクトリを基準にdataディレクトリを追加
const commentsPath = path.join(commentsDir, "comments.json"); //jsonのパスを設定

// 初期化の処理
if (!fs.existsSync(commentsDir)) {
	fs.mkdirSync(commentsDir); //dataディレクトリが存在しない場合は作成
}

// 初期値として空の "comments" 配列を含むオブジェクトを保存
fs.writeFileSync(
	commentsPath,
	JSON.stringify({ topics: [] }, null, 2),
	"utf-8",
);

app.post("/post-topic-and-comment", (req, res) => {
	const { id, topic, comment } = req.body;
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { topics: [] };

	// トピックが既に存在するか確認
	const existingTopic = data.topics.find((t) => t.id === id);

	if (existingTopic) {
		existingTopic.comments.push(comment);
	} else {
		data.topics.push({
			id,
			name: topic,
			comments: [comment],
		});
	}

	fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2), "utf-8");
	res.json(req.body);
});

app.get("/get-topic-and-comment", (req, res) => {
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { topics: [] };

	res.json(data.topics || []); // ← 配列だけ返す！
});

// POST: コメントを追加
app.post("/post-comments", (req, res) => {
	const data = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
	data.comments.push(req.body.comment); // req.body は文字列
	fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2), "utf-8");
	res.json(req.body);
});

// GET: コメント取得
app.get("/get-comments", (req, res) => {
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { comments: [] };

	res.json(data.comments || []); // ← 配列だけ返す！
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

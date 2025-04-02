const express = require("express");
const fs = require("fs"); //ファイル操作用
const path = require("path");
const cors = require("cors"); //別のポートからのリクエストを許可するためのミドルウェア
const fetch = require("node-fetch");

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

app.get("/api/geoip", async (req, res) => {
	const ip = req.query.ip;

	try {
		const response = await fetch(`https://ipwho.is/${ip}`);
		const data = await response.json();

		if (!data.success) {
			throw new Error(data.message || "Unknown error from ipwho.is");
		}

		res.json(data);
	} catch (error) {
		console.error(`GeoIP fetch failed [${ip}]:`, error.message || error);
		res.status(500).json({ error: error.message || "GeoIP fetch error" });
	}
});

app.post("/api/save-ip", async (req, res) => {
	//IP-address.jsonにIPアドレスを保存
	const ip = req.body.ip;
	if (!ip) return res.status(400).json({ error: "IPアドレスがありません。" });

	const ip_path = path.join(__dirname, "data", "IP-address.json");
	const ipdata = fs.existsSync(ip_path)
		? JSON.parse(fs.readFileSync(ip_path, "utf-8"))
		: []; //IP-address.jsonが存在しなかったら空のデータにする
	try {
		const geoRes = await fetch(`https://ipwho.is/${ip}`);
		const geoData = await geoRes.json();
		if (!geoData.success) {
			throw new Error(geoData.message || "IP変換に失敗しました");
		}
		const newEntry = {
			ip,
			lat: geoData.latitude,
			lon: geoData.longitude,
		};
		ipdata.push(newEntry);
		fs.writeFileSync(ip_path, JSON.stringify(ipdata, null, 2), "utf-8");
		console.log(`ipの情報を保存しました: ${ip}`);
		res.json({ success: true, data: newEntry });
	} catch (err) {
		console.error(`IP取得に失敗しました [${ip}]`, err.message);
		res.status(500).json({ success: false, error: "IP変換に失敗しました" });
	}
});

app.get("/api/iplist-return", (req, res) => {
	const ip_path = path.join(__dirname, "data", "IP-address.json");
	try {
		if (!fs.existsSync(ip_path)) {
			//IP-address.jsonがないときは空の配列を返す
			return res.json([]);
		}
		const data = JSON.parse(fs.readFileSync(ip_path, "utf-8"));
		res.json(data);
	} catch (err) {
		console.error("IPリストの読み込みに失敗:", err);
		res.status(500).json({ error: "IPリストの読み込み失敗" });
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

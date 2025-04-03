const express = require("express");
const fs = require("fs"); //ファイル操作用
const path = require("path");
const cors = require("cors"); //別のポートからのリクエストを許可するためのミドルウェア
const fetch = require("node-fetch");
const { feature } = require("topojson-client");
const { geoContains } = require("d3-geo");
require("dotenv").config({ path: path.join(__dirname, "../.env") }); //server.cjsからgemini使う

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
			id: id,
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
	const ip = req.body.ip;
	if (!ip) return res.status(400).json({ error: "IPアドレスがありません。" });

	const ip_path = path.join(__dirname, "data", "IP-address.json");

	// ステップ1: 既存データをロード（なければ空）
	const ipdata = fs.existsSync(ip_path)
		? JSON.parse(fs.readFileSync(ip_path, "utf-8"))
		: [];

	// ステップ2: すでに保存されているIPならキャッシュとして返す！
	const cached = ipdata.find((entry) => entry.ip === ip);
	if (cached) {
		console.log(`キャッシュからIP取得: ${ip}`);
		return res.json({ success: true, data: cached });
	}

	// ステップ3: キャッシュにないならAPIから取得
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

		console.log(`新しくIP情報を保存しました: ${ip}`);
		res.json({ success: true, data: newEntry });
	} catch (err) {
		console.error(`IP変換に失敗しました [${ip}]`, err.message);
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

// newer get sentiment function
const topojsonPath = path.join(__dirname, "/map/japan.topojson");
const rawTopoJson = JSON.parse(fs.readFileSync(topojsonPath, "utf-8"));
const geoJsonData = feature(rawTopoJson, rawTopoJson.objects.japan).features;
const ipCachePath = path.join(__dirname, "data", "IP-address.json");
const sentimentPath = path.join(__dirname, "data", "prefectureSentiment.json");

// Get Coordinates function　IP->座標の変換
async function getCoordinatesFromIP(ip) {
	const ipData = fs.existsSync(ipCachePath)
		? JSON.parse(fs.readFileSync(ipCachePath, "utf-8"))
		: [];

	const cached = ipData.find((entry) => entry.ip === ip);
	if (cached) return [cached.lon, cached.lat];

	const res = await fetch(`https://ipwho.is/${ip}`);
	const data = await res.json();

	if (!data.success) throw new Error(data.message);

	const newEntry = { ip, lat: data.latitude, lon: data.longitude };
	ipData.push(newEntry);
	fs.writeFileSync(ipCachePath, JSON.stringify(ipData, null, 2), "utf-8");

	return [newEntry.lon, newEntry.lat];
}

// Get PrefCode function 座標から都道府県を取得
function getPrefCodeFromCoordinates(coord, geoFeatures) {
	const matched = geoFeatures.find((geo) => geoContains(geo, coord));
	if (!matched) throw new Error("Prefecture not found");
	return `JP-${String(matched.properties.id).padStart(2, "0")}`;
}

// Classify Sentiment function Geminiを使ってコメントの感情を分類
async function classifySentimentWithGemini(topic, comment) {
	const prompt = `
次のTopicに対するCommentの内容を、"positive","neutral","negative"の三つの中のいずれかに分類してください。

Topic: ${topic}
Comment: ${comment}

Respond with only the classification string.
`;
	const apiKey = process.env.VITE_GEMINI_API_KEY; //.envファイルにあるKEYとURLを持ってくる。フロントエンド用のをバックエンドでも使っているのであまりよくない。
	const apiUrl = process.env.VITE_GEMINI_API_URL;
	if (!apiUrl || !apiKey) {
		throw new Error(
			"GEMINI_API_URLかGEMINI_API_KEY、またはその両方がありません。",
		);
	}
	const res = await fetch(`${apiUrl}?key=${apiKey}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}),
	});

	const data = await res.json();
	const sentiment = data?.candidates?.[0]?.content?.parts?.[0]?.text
		?.trim()
		.toLowerCase();

	if (!["positive", "neutral", "negative"].includes(sentiment)) {
		throw new Error(`Invalid sentiment result: ${sentiment}`);
	}

	return sentiment;
}
// Update Sentiment file function 感情をトピック、都道府県ごとにまとめてファイルに保存

function updatePrefectureSentiment(topicId, prefCode, sentiment) {
	const data = fs.existsSync(sentimentPath)
		? JSON.parse(fs.readFileSync(sentimentPath, "utf-8"))
		: {};

	if (!data[topicId]) data[topicId] = {};
	if (!data[topicId][prefCode])
		data[topicId][prefCode] = { positive: 0, neutral: 0, negative: 0 };

	data[topicId][prefCode][sentiment]++;
	fs.writeFileSync(sentimentPath, JSON.stringify(data, null, 2), "utf-8");
}
// Sentiment Flow トピックID,トピックの内容,投稿されたコメント(1件),IPアドレスを受け取って処理する
app.post("/api/update-sentiment", async (req, res) => {
	const { topicId, topicContent, comment, ipAddr } = req.body;

	if (!topicId || !topicContent || !comment || !ipAddr) {
		return res.status(400).json({ error: "Missing parameters" });
	}

	try {
		const coord = await getCoordinatesFromIP(ipAddr);
		const prefCode = getPrefCodeFromCoordinates(coord, geoJsonData);
		const sentiment = await classifySentimentWithGemini(topicContent, comment);
		updatePrefectureSentiment(topicId, prefCode, sentiment);

		console.log(
			`[✅] Sentimentが更新された! → topic ${topicId}, ${prefCode}, ${sentiment}`,
		);
		res.json({ success: true, prefCode, sentiment });
	} catch (err) {
		console.error("Update failed:", err.message);
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/get-prefecture-sentiment", (req, res) => {
	const sentimentPath = path.join(
		__dirname,
		"data",
		"prefectureSentiment.json",
	);
	if (!fs.existsSync(sentimentPath)) return res.json({});
	const data = JSON.parse(fs.readFileSync(sentimentPath, "utf-8"));
	res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

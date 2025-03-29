const express = require("express");
const fs = require("fs");//ファイル操作用
const path = require("path");
const cors = require("cors");//別のポートからのリクエストを許可するためのミドルウェア
const fetch=require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors());//corsを許可

const commentsDir = path.join(__dirname, "data");//現在のディレクトリを基準にdataディレクトリを追加
const commentsPath = path.join(commentsDir, "comments.json");//jsonのパスを設定
//初期化の処理
if (!fs.existsSync(commentsDir)) {
	fs.mkdirSync(commentsDir);//dataディレクトリが存在しない場合は作成
}

if (fs.existsSync(commentsPath)) {
	fs.unlinkSync(commentsPath); // あれば削除
}

fs.writeFileSync(commentsPath, "[]", "utf-8"); // 毎回空ファイルを新規作成


app.post("/post-comments", (req, res) => {
	const comments = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
	comments.push(req.body);
	fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2), "utf-8");
	res.json(req.body);
});

app.get("/get-comments", (req, res) => {
	const comments = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
	res.json(comments);
});


app.get("/api/geoip", async (req, res) => {
	const ip = req.query.ip;
	if (!ip) return res.status(400).json({ error: "Missing IP" });

	try {
		const geoRes=await fetch(`https://ipwho.is/${ip}`);
		// APIからのレスポンスが正しいJSONか確認
		const data=await geoRes.json();
		if(!data.success){
			console.error(`GeoIP fetch failed [${ip}]: ${data.messege}`);
			return res.status(500).json({error:"GeoIP API Error", detail:data.message});
		}
		res.json(data);
	} catch (err) {
		console.error("GeoIP fetch failed:", err);
		res.status(500).json({ error: "Failed to fetch IP location" });
	}
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

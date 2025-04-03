import { makeSubTopicFromUSRL } from "./api/gemini"; //geminiからサブトピックを取得するための関数をインポート
express = require("express");
const fs = require("fs"); //ファイル操作用
const path = require("path");
const cors = require("cors"); //別のポートからのリクエストを許可するためのミドルウェア

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const commentsDir = path.join(__dirname, "data"); //現在のディレクトリを基準にdataディレクトリを追加
const commentsPath = path.join(commentsDir, "comments.json"); //jsonのパスを設定

// Topic型の模倣
/**
 * @typedef {Object} Topic
 * @property {string} id - トピックのID
 * @property {string} name - トピック名
 * @property {string[]} comments - コメントの配列
 * @property {Topic[]} [subTopic] - サブトピックの配列 (オプション)
 */

// 初期化の処理
if (!fs.existsSync(commentsDir)) {
	fs.mkdirSync(commentsDir); //dataディレクトリが存在しない場合は作成
}

// 初期値として空の "topics" 配列を含むオブジェクトを保存
fs.writeFileSync(
	commentsPath,
	JSON.stringify({ topics: [] }, null, 2),
	"utf-8",
);

app.post("/post-topic-and-comment", (req, res) => {
	const { id, topic, comment } = req.body;

	/** @type {{ topics: Topic[] }} */
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { topics: [] };

	// トピックが既に存在するか確認
	const existingTopic = data.topics.find((t) => t.id === id);

	if (existingTopic) {
		existingTopic.comments.push(comment);

		// コメント数が5になったら subTopic を生成
		if (existingTopic.comments.length === 5) {
			//サブトピックを生成するために、makeSubTopicFromUSRLを呼び出す
			const topics = data.topics;
			const topicName = existingTopic.name;

			//非同期処理を行うために、async/awaitを使用
			(async () => {
				try {
					const subTopicNames = await makeSubTopicFromUSRL(topicName);
					console.log("Subtopic names:", subTopicNames);
					existingTopic.subTopic = [
						{
							id: `${id}-sub1`,
							name:
								subTopicNames.split("\n")[0] ||
								`${existingTopic.name} - SubTopic 1`, //geminiから取得したサブトピック名
							comments: [],
						},
						{
							id: `${id}-sub2`,
							name:
								subTopicNames.split("\n")[1] ||
								`${existingTopic.name} - SubTopic 2`, //geminiから取得したサブトピック名
							comments: [],
						},
					];

					//更新されたデータを保存
					fs.writeFileSync(
						commentsPath,
						JSON.stringify(data, null, 2),
						"utf-8",
					);
				} catch (error) {
					console.error("Error generating subtopics:", error);
				}
			})();
		}
	} else {
		/** @type {Topic} */
		const newTopic = {
			id: id,
			name: topic,
			comments: [comment],
		};
		data.topics.push(newTopic);
	}

	fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2), "utf-8");
	res.json(req.body);
});

app.get("/get-topic-and-comment", (req, res) => {
	/** @type {{ topics: Topic[] }} */
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { topics: [] };

	res.json(data.topics || []); // ← 配列だけ返す！
});

// POST: コメントを追加
app.post("/post-comments", (req, res) => {
	/** @type {{ topics: Topic[] }} */
	const data = JSON.parse(fs.readFileSync(commentsPath, "utf-8"));
	data.comments.push(req.body.comment); // req.body は文字列
	fs.writeFileSync(commentsPath, JSON.stringify(data, null, 2), "utf-8");
	res.json(req.body);
});

// GET: コメント取得
app.get("/get-comments", (req, res) => {
	/** @type {{ topics: Topic[] }} */
	const data = fs.existsSync(commentsPath)
		? JSON.parse(fs.readFileSync(commentsPath, "utf-8"))
		: { comments: [] };

	res.json(data.comments || []); // ← 配列だけ返す！
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

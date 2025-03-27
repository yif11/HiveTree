const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const commentsPath = path.join(__dirname, "data/comments.json");

if (!fs.existsSync(commentsPath)) {
	fs.writeFileSync(commentsPath, "[]", "utf-8");
}

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

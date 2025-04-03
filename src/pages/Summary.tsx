import type React from "react";
import { useState } from "react";
import useSWR from "swr";
import { getTopicAndComments, postTopicAndComment } from "../api/api";
import { postUserIP } from "../api/api";
import { fetchSummaryFromGemini } from "../api/gemini"; // 追加：Gemini関数のインポート
import { getTopic } from "../api/topic";
import MapPostArea from "./MapPostArea";

type postData = {
	id: string;
	topic: string;
	comment: string;
};

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");
	const [topicId, setTopicId] = useState("");
	const [topicUrl, setTopicUrl] = useState("");
	const [topicTitle, setTopicTitle] = useState("");
	const [topicSummary, setTopicSummary] = useState("");
	const [topicLevel, setTopicLevel] = useState(0);

	const { error: topicError } = useSWR(
		"/topic",
		async () => {
			const topics = await getTopic();
			setTopicId(topics.length > 0 ? topics[0].id : "No ID");
			setTopicUrl(topics.length > 0 ? topics[0].url : "No URL");
			setTopicTitle(topics.length > 0 ? topics[0].title : "No Title");
			setTopicSummary(topics.length > 0 ? topics[0].summary : "No Summary");
		},
		{
			refreshInterval: 3600000, // 3600秒ごとにポーリング
		},
	);

	// SWRを使って要約を定期取得（10秒ごと）
	const { data: summary, error: summaryError } = useSWR(
		"/summary",
		async () => {
			// const comments = await getComments();
			const topicAndComments = await getTopicAndComments();
			if (topicTitle === "") {
				throw new Error("トピックが取得できていません");
			}
			// return await fetchSummaryFromGemini(topic, comments);
			setTopicLevel(() => {
				const matchingTopic = topicAndComments.find(
					(topic) => topic.id === topicId,
				);
				return matchingTopic
					? Math.min(4, Math.floor(matchingTopic.comments.length / 3))
					: 0;
			});
			return await fetchSummaryFromGemini(topicUrl, topicAndComments);
		},
		{
			refreshInterval: 10000, // 10秒ごとにポーリング
		},
	);

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const handleCommentSubmit = async () => {
		setComment("");
		const postData: postData = {
			id: topicId,
			topic: topicTitle,
			comment: comment,
		};
		await postTopicAndComment(postData); // トピックとコメントを送信（即時要約更新なし）

		try {
			//IPアドレスを取得してサーバに送信する
			const response = await fetch("https://api.ipify.org?format=json");
			const data = await response.json();
			const ip = data.ip;
			//await postUserIP(data.ip);
			console.log(`Send IP: ${data.ip}!!`);
			const res = await fetch("http://localhost:5000/api/update-sentiment", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topicId: topicId,
					topicContent: topicTitle,
					comment: comment,
					ipAddr: ip,
				}),
			});
			if (!res.ok) {
				const err = await res.json();
				console.error("Sentimentの更新に失敗しました:", err.error);
			} else {
				console.log("Sentimentが更新されました");
			}
		} catch (error) {
			console.error("Failed to fetch or send user IP:", error);
		}
	};

	return (
		// メインコンテナ
		<div className="summary-container h-screen w-screen overflow-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
			<h1 className="text-4xl font-extrabold text-gray-800 tracking-tight border-b pb-4 border-gray-300">
				🌟 Summary of Comments on Topic
			</h1>

			{/* トピック表示 */}
			<div className="topic bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
				<h2 className="text-2xl font-semibold text-gray-700 mb-2">📌 Topic</h2>
				{topicError ? (
					<p className="text-red-600">⚠️ トピックの取得に失敗しました。</p>
				) : (
					<>
						<p className="text-black text-lg leading-relaxed">
							トピックID:
							{topicId || "（トピックID取得中）"}
						</p>
						<p className="text-black text-lg leading-relaxed">
							トピックURL:
							{topicUrl || "（トピックURL取得中）"}
						</p>
						<p className="text-black text-lg leading-relaxed">
							トピックタイトル:
							{topicTitle || "（トピックタイトル取得中）"}
						</p>
						<p className="text-black text-lg leading-relaxed">
							トピックサマリ:
							{topicSummary || "（トピックサマリ取得中）"}
						</p>
					</>
				)}
			</div>

			{/* コメント入力フォーム */}
			<div className="comment bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
				<h2 className="text-2xl font-semibold text-gray-700 mb-3">
					💬 Comment
				</h2>
				{/*コメント入力欄*/}
				<textarea
					className="w-full min-h-[100px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-400 transition"
					placeholder="Enter your comment..."
					value={comment}
					onChange={handleCommentChange}
				/>
				{/*コメント送信ボタン*/}
				<button
					type="button"
					className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
					onClick={handleCommentSubmit}
				>
					➤ Submit Comment
				</button>
			</div>

			{/* 要約表示 */}
			<div className="summary bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-inner">
				<h2 className="text-2xl font-semibold text-red-600 mb-3">📝 要約</h2>
				<div className="text-gray-700 mb-2">topicLevel: {topicLevel}</div>

				{/* 要約結果表示 */}
				{summaryError ? (
					<p className="text-red-600">⚠️ 要約の取得に失敗しました。</p>
				) : (
					<p className="text-red-700 text-lg leading-relaxed">
						{summary || "（まだ要約はありません）"}
					</p>
				)}
			</div>
			<MapPostArea topicId={topicId} />
		</div>
	);
};

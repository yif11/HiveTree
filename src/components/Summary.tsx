import type React from "react";
import { useState } from "react";
import useSWR from "swr";
import { getTopicAndComments, postTopicAndComment } from "../api/api";
import { fetchSummaryFromGemini } from "../api/gemini"; // 追加：Gemini関数のインポート
import { getTopic } from "../api/topic";

type postData = {
	id: number;
	topic: string;
	comment: string;
};

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");
	const [topic, setTopic] = useState("");

	const { error: topicError } = useSWR(
		"/topic",
		async () => {
			setTopic(await getTopic());
		},
		{
			refreshInterval: 10000, // 10秒ごとにポーリング
		},
	);

	// SWRを使って要約を定期取得（10秒ごと）
	const { data: summary, error: summaryError } = useSWR(
		"/summary",
		async () => {
			// const comments = await getComments();
			const topicAndComments = await getTopicAndComments();
			const id = 0; // トピックID（仮）
			// const topic = "天気";
			if (topic === "") {
				throw new Error("トピックが取得できていません");
			}
			// return await fetchSummaryFromGemini(topic, comments);
			return await fetchSummaryFromGemini(id, topicAndComments);
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
			id: 0, // トピックID（仮）
			topic: topic,
			comment: comment,
		};
		await postTopicAndComment(postData); // トピックとコメントを送信（即時要約更新なし）
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
					<p className="text-red-700 text-lg leading-relaxed">
						{topic || "（トピック取得中）"}
					</p>
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
				{/* 要約結果表示 */}
				{summaryError ? (
					<p className="text-red-600">⚠️ 要約の取得に失敗しました。</p>
				) : (
					<p className="text-red-700 text-lg leading-relaxed">
						{summary || "（まだ要約はありません）"}
					</p>
				)}
			</div>
		</div>
	);
};

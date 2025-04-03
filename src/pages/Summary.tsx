import type React from "react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getTopicAndComments, postTopicAndComment } from "../api/api";
import { fetchSummaryFromGemini } from "../api/gemini"; // 追加：Gemini関数のインポート
// import { getTopic } from "../api/topic";

type postData = {
	id: string;
	topic: string;
	comment: string;
};

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");
	const [topic, setTopic] = useState<{
		id: string;
		url: string;
		title: string;
		summary: string;
		subtopics?: { id: string; title: string; summary: string }[];
	} | null>({
		id: "No ID",
		url: "No URL",
		title: "No Title",
		summary: "No Summary",
	});
	const [topicLevel, setTopicLevel] = useState(0);
	const [matchingComments, setMatchingComment] = useState<string[] | null>(
		null,
	);
	// const [summary, setSummary] = useState<string | null>(null);
	// const [summaryError, setSummaryError] = useState<Error | null>(null);

	// SWRを使って要約を定期取得（10秒ごと）
	const { data: summary, error: summaryError } = useSWR(
		"/summary",
		async () => {
			const topicData = sessionStorage.getItem("topic");
			if (topicData) {
				const parsedTopic = JSON.parse(topicData);
				await setTopic(parsedTopic);
			}

			// const comments = await getComments();
			if (!topic) {
				throw new Error("No topic selected");
			}
			const topicAndComments = await getTopicAndComments(topic.id);
			if (!topic.title) {
				throw new Error("トピックが取得できていません");
			}
			// return await fetchSummaryFromGemini(topic, comments);
			const matchingTopic = topicAndComments.find(
				(gotTopic) => gotTopic.id === topic.id,
			);
			if (matchingTopic) {
				setMatchingComment(matchingTopic.comments);
				console.log("matchingComment", matchingComments);
			}

			// console.log("matchingTopic", matchingTopic);
			setTopicLevel(() => {
				// const matchingTopic = topicAndComments.find(
				// 	(gotTopic) => gotTopic.id === topic.id,
				// );
				return matchingTopic
					? Math.min(4, Math.floor(matchingTopic.comments.length / 3))
					: 0;
			});
			// return await fetchSummaryFromGemini(topic.url, topicAndComments);
			// console.log("matchingComment", matchingComment);
			console.log("topic.url", topic.url);
			return await fetchSummaryFromGemini(topic.url, [
				{ name: topic.title, comments: matchingComments || [] },
			]);
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
			id: topic ? topic.id : "no-topic",
			topic: topic ? topic.title : "no-topic",
			comment: comment,
		};
		await postTopicAndComment(postData); // トピックとコメントを送信（即時要約更新なし）
	};

	// TopicListから渡されたトピック情報を受け取る
	// Summaryコンポーネントがマウントされたときに一度だけ実行
	useEffect(() => {
		const topicData = sessionStorage.getItem("topic");
		if (topicData) {
			const parsedTopic = JSON.parse(topicData);
			setTopic(parsedTopic);
		}
	}, []); // 空の依存配列でマウント時のみ実行

	return (
		// メインコンテナ
		<div className="summary-container h-screen w-screen overflow-auto p-8 font-sans bg-[#f2f9f2]">
			<div className="mt-4 max-md:text-center">
				<button
					type="button"
					onClick={() => {
						window.location.href = "http://localhost:5173/";
					}}
					className="bg-[#A9C8A9] text-white border-none rounded-full px-8 py-4 text-lg mb-8 cursor-pointer shadow-md"
				>
					トップページへ戻る
				</button>
			</div>
			<h1 className="text-4xl font-extrabold text-gray-800 tracking-tight border-b pb-4 mb-4 border-gray-300">
				🌟 Summary of Comments on Topic
			</h1>

			{/* トピック表示 */}
			<div className="topic bg-white p-6 mb-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
				<h2 className="text-2xl font-semibold text-gray-700 mb-2">📌 Topic</h2>
				{/* topicErrorを削除 */}
				<>
					<p className="text-black text-lg leading-relaxed">
						トピックID:
						{topic ? topic.id : "（トピックID取得中）"}
					</p>
					<p className="text-black text-lg leading-relaxed">
						トピックURL:
						{topic ? topic.url : "（トピックURL取得中）"}
					</p>
					<p className="text-black text-lg leading-relaxed">
						トピックタイトル:
						{topic ? topic.title : "（トピックタイトル取得中）"}
					</p>
					<p className="text-black text-lg leading-relaxed">
						トピックサマリ:
						{topic ? topic.summary : "（トピックサマリ取得中）"}
					</p>
				</>
			</div>

			{/* コメント入力フォーム */}
			<div className="comment bg-white p-6 mb-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
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
			<div className="summary bg-red-50 border-l-4 border-red-400 p-6 mb-4 rounded-lg shadow-inner">
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
		</div>
	);
};

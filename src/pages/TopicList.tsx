import type React from "react";
import { useState } from "react";
import useSWR from "swr";
import { getTopic } from "../api/topic";

export const TopicList: React.FC = () => {
	const [topicId, setTopicId] = useState("");
	const [topicUrl, setTopicUrl] = useState("");
	const [topicTitle, setTopicTitle] = useState("");
	const [topicSummary, setTopicSummary] = useState("");

	const { error: topicError } = useSWR(
		"/topic-list",
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

	return (
		// メインコンテナ
		<div className="summary-container h-screen w-screen overflow-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
			<h1 className="text-4xl font-extrabold text-gray-800 tracking-tight border-b pb-4 border-gray-300">
				🌟 Topic List
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
		</div>
	);
};

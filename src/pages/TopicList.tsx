import type React from "react";
import useSWR from "swr";
import { getTopic } from "../api/topic";

export const TopicList: React.FC = () => {
	const { data: topics, error: topicError } = useSWR(
		"/topic-list",
		async () => {
			return await getTopic();
		},
		{
			// refreshInterval: 3600000, // 3600秒ごとにポーリング
		},
	);

	return (
		// メインコンテナ
		<div className="summary-container h-screen w-screen overflow-auto p-8 bg-gradient-to-br from-gray-100 to-gray-200 font-sans">
			<h1 className="text-4xl font-extrabold text-gray-800 tracking-tight border-b pb-4 border-gray-300">
				🌟 Topic List
			</h1>

			{topicError ? (
				<p className="text-red-600">⚠️ トピックの取得に失敗しました。</p>
			) : !topics ? (
				<p>Loading topics...</p>
			) : (
				<div className="mt-4">
					{topics.map(
						(topic: {
							id: string;
							url: string;
							title: string;
							summary: string;
						}) => (
							<div
								key={topic.id}
								className="topic bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4 cursor-pointer"
								onClick={() => {
									sessionStorage.setItem("topic", JSON.stringify(topic));
									window.location.href = "/summary";
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										sessionStorage.setItem("topic", JSON.stringify(topic));
										window.location.href = "/summary";
									}
								}}
							>
								<a
									href="/summary"
									onClick={() =>
										sessionStorage.setItem("topic", JSON.stringify(topic))
									}
								>
									<h2 className="text-2xl font-semibold text-gray-700 mb-2 hover:text-blue-500">
										{topic.title}
									</h2>
								</a>
								<p className="text-black text-lg leading-relaxed">
									トピックID: {topic.id}
								</p>
								<p className="text-black text-lg leading-relaxed">
									トピックURL: {topic.url}
								</p>
								<p className="text-black text-lg leading-relaxed">
									トピックタイトル: {topic.title}
								</p>
								<p className="text-black text-lg leading-relaxed">
									トピックサマリ: {topic.summary}
								</p>
							</div>
						),
					)}
				</div>
			)}
		</div>
	);
};

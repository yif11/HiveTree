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
							subtopics: { id: string; title: string; summary: string }[];
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
								{topic.subtopics?.map((subtopic) => (
									<div
										key={subtopic.id}
										className="subtopic bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-2 ml-4 cursor-pointer"
										onClick={() => {
											sessionStorage.setItem(
												"currentSubtopic",
												JSON.stringify(subtopic),
											);
											window.location.href = "/summary";
										}}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												sessionStorage.setItem(
													"topic",
													JSON.stringify(subtopic),
												);
												window.location.href = "/summary";
											}
										}}
									>
										<a
											href="/summary"
											onClick={() =>
												sessionStorage.setItem(
													"topic",
													JSON.stringify(subtopic),
												)
											}
										>
											<h3 className="text-xl font-semibold text-gray-600 mb-1 hover:text-blue-500">
												{subtopic.title}
											</h3>
										</a>
										<p className="text-black text-lg leading-relaxed">
											サブトピックID: {subtopic.id}
										</p>
										<p className="text-black text-lg leading-relaxed">
											サブトピックサマリ: {subtopic.summary}
										</p>
									</div>
								))}
							</div>
						),
					)}
				</div>
			)}
		</div>
	);
};

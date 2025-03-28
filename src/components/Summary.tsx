import type React from "react";
import { useState } from "react";
import { getComments, postComment } from "../api/api";
import { fetchSummaryFromGemini } from "../api/gemini"; // 追加：Gemini関数のインポート

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");
	const [summary, setSummary] = useState("");
	const [loading, setLoading] = useState(false); // ローディング状態

	// テキストエリアに変化が起こったとき，その中の値を`comment`変数にセット
	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	// Submit Comment ボタンが押されたとき，アラートを表示し，`comment`変数をリセット
	// また，`summary`変数に`comment`変数の値をセット
	const handleCommentSubmit = async () => {
		// alert(`Submitted comment: ${comment}`);
		setComment("");

		// setSummary(comment);
		await postComment(comment); // コメントをサーバーに送信
		setLoading(true); // ローディング開始

		try {
			const comments = await getComments(); // 全コメント取得
			const topic = "天気"; // ※ トピック名は仮置き（あとでUIで選べるようにできる）

			const result = await fetchSummaryFromGemini(topic, comments); // Geminiによる要約
			setSummary(result);
		} catch (error) {
			console.error("Gemini要約エラー:", error);
			setSummary("要約に失敗しました。");
		} finally {
			setLoading(false); // ローディング終了
		}
	};

	return (
		<div className="summary-container p-4 bg-gray-200">
			<h1 className="pb-4 text-3xl font-bold">Summary of Comments on Topic</h1>

			{/* トピック */}
			<div className="topic bg-gray-400 p-2 mb-2">
				<h2 className="text-2xl">topic</h2>
				example topic
			</div>

			{/* コメント */}
			<div className="comment bg-blue-400 p-2 mb-2">
				<h2 className="text-2xl">comment</h2>
				<textarea
					className="w-full p-2 border border-white rounded"
					placeholder="Enter your comment..."
					value={comment}
					onChange={handleCommentChange}
				/>
				<button
					type="button"
					className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					onClick={handleCommentSubmit}
				>
					Submit Comment
				</button>
			</div>

			{/* サマリ */}
			<div className="summary text-2xl bg-red-400 p-4 mb-2 rounded">
				<h2 className="text-xl font-bold mb-2">要約</h2>
				{loading ? (
					<div className="animate-pulse text-gray-600">⏳ 要約を生成中です...</div>
				) : (
					<p>{summary || "（まだ要約はありません）"}</p>
				)}
			</div>
		</div>
	);
};

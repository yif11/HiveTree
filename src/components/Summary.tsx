import type React from "react";
import { useState } from "react";

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");
	const [summary, setSummary] = useState("");

	// テキストエリアに変化が起こったとき，その中の値を`comment`変数にセット
	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	// Submit Comment ボタンが押されたとき，アラートを表示し，`comment`変数をリセット
	// また，`summary`変数に`comment`変数の値をセット
	const handleCommentSubmit = () => {
		// alert(`Submitted comment: ${comment}`);
		setComment("");
		setSummary(comment);
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
			<div className="summary text-2xl bg-red-400 p-2 mb-2">
				<h2 className="text-2xl">summary</h2>
				<span>(Submitted comment: {summary})</span>
			</div>
		</div>
	);
};

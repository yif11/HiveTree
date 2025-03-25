import type React from "react";
import { useState } from "react";

export const Summary: React.FC = () => {
	const [comment, setComment] = useState("");

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.target.value);
	};

	const handleCommentSubmit = () => {
		alert(`Submitted comment: ${comment}`);
		setComment("");
	};

	return (
		<div className="summary-container p-4 bg-gray-200">
			<h1 className="pb-4 text-3xl font-bold">Summary of Comments on Topic</h1>

			<div className="topic text-2xl bg-gray-400 p-2 mb-2">topic</div>

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

			<div className="summary text-2xl bg-red-400 p-2 mb-2">summary</div>
		</div>
	);
};

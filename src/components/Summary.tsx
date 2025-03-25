import type React from "react";

export const Summary: React.FC = () => {
	return (
		<div className="summary-container p-4 font-bold bg-gray-200">
			<h1 className="pb-4 text-3xl font-bold">Summary</h1>
			<div className="topic bg-gray-400">topic</div>
			<div className="comment bg-blue-400">comment</div>
			<div className="summary bg-red-400">summary</div>
		</div>
	);
};

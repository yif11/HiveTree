const apiUrl = "http://localhost:5000";

export const getTopic = async () => {
	try {
		const response = await fetch(`${apiUrl}/topic`);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		return data.topic;
	} catch (error) {
		console.error("Failed to fetch topic:", error);
		throw error;
	}
};

export const postComment = async (comment: string) => {
	const response = await fetch(`${apiUrl}/post-comments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ comment }),
	});
	const data = await response.json();
	return data;
};

export const getComments = async () => {
	try {
		const response = await fetch(`${apiUrl}/get-comments`);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();

		if (!Array.isArray(data)) {
			throw new Error(
				"Unexpected response format: Expected an array of comments.",
			);
		}

		return data.map((item) =>
			typeof item === "object" && item.comment ? item.comment : item,
		);
	} catch (error) {
		console.error("Failed to fetch comments:", error);
		throw error;
	}
};

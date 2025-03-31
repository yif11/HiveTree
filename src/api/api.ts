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

export const postTopicAndComment = async (postData: {
	id: number;
	topic: string;
	comment: string;
}) => {
	const response = await fetch(`${apiUrl}/post-topic-and-comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(postData),
	});
	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}
	const data = await response.json();
	if (data.error) {
		throw new Error(`Error: ${data.error}`);
	}
	return data;
};

export const getTopicAndComments = async () => {
	try {
		const response = await fetch(`${apiUrl}/get-topic-and-comment`);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		if (!Array.isArray(data)) {
			throw new Error(
				"Unexpected response format: Expected an array of comments.",
			);
		}
		// return data.map((item) =>
		// 	typeof item === "object" && item.comment ? item.comment : item,
		// );
		return data.map((item) =>
			typeof item === "object" && item.comment && item.topic
				? { topic: item.topic, comment: item.comment }
				: item,
		);
	} catch (error) {
		console.error("Failed to fetch topic and comments:", error);
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
	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}
	const data = await response.json();
	if (data.error) {
		throw new Error(`Error: ${data.error}`);
	}
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

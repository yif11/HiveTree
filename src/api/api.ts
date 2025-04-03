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
	id: string;
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

export const getTopicAndComments = async (topicId: string) => {
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
		return data
			.map((item) =>
				typeof item === "object" && item.comments && item.topic
					? { id: item.id, topic: item.topic, comments: item.comments }
					: item,
			)
			.filter(
				(item: { id: string; topic: string; comments: string[] }) =>
					item.id === topicId,
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

export const postUserIP = async (ip: string) => {
	const res = await fetch("http://localhost:5000/api/save-ip", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ ip }),
	});
	return await res.json();
};

export type SavedIPEntry = {
	ip: string;
	lat: number;
	lon: number;
};

export const getSavedIPs = async (): Promise<SavedIPEntry[]> => {
	const res = await fetch("http://localhost:5000/api/iplist-return");
	return await res.json();
};

export async function getPrefectureSentiment(): Promise<{
	[topicId: string]: {
		[prefCode: string]: {
			positive: number;
			neutral: number;
			negative: number;
		};
	};
}> {
	const res = await fetch("http://localhost:5000/api/get-prefecture-sentiment");
	return await res.json();
}

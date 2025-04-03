export async function fetchSummaryFromGemini(
	topicUrl: string,
	topics: { name: string; comments: string[] }[],
): Promise<string> {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
	const apiUrl = import.meta.env.VITE_GEMINI_API_URL as string;

	const prompt = `
あなたは優秀な要約AIです。
トピック「${topicUrl}」に関する複数人の投稿があります。
このトピックのURLにアクセスして記事を読み、複数人の投稿を1つの要約文にしてください。

投稿：
${topics.flatMap((topic) => topic.comments.map((p, i) => `投稿${i + 1}：${p}`)).join("\n")}

要約：
  `;

	const response = await fetch(`${apiUrl}?key=${apiKey}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}),
	});

	const data = await response.json();
	console.log(JSON.stringify(data, null, 2));
	return (
		data.candidates?.[0]?.content?.parts?.[0]?.text ?? "要約に失敗しました"
	);
}

export async function summarizeArticleFromURL(
	url: string,
	title: string,
): Promise<string> {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
	const apiUrl = import.meta.env.VITE_GEMINI_API_URL as string;

	const prompt = `
あなたは優秀な要約AIです。
以下に記事のタイトルとURLを取得しました。
この記事の内容を日本語で要約してください。
タイトル: ${title}
記事URL: ${url}
要約：
`;

	const response = await fetch(`${apiUrl}?key=${apiKey}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			contents: [
				{
					parts: [{ text: prompt }],
				},
			],
		}),
	});

	const data = await response.json();
	return (
		data.candidates?.[0]?.content?.parts?.[0]?.text ?? "要約に失敗しました"
	);
}

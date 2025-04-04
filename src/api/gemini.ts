export async function fetchSummaryFromGemini(
	topicUrl: string,
	topics: { name: string; comments: string[] }[],
): Promise<string> {
	const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
	const apiUrl = import.meta.env.VITE_GEMINI_API_URL as string;

	const prompt = `
あなたは優秀な要約AIです。
トピック「${topicUrl}」に関する複数人のSNSの投稿があります。以下のSNSの投稿を要約し、総意が肯定的な意見と否定的な意見のどちらに偏っているかを示した上で、それぞれの意見を要約してください。ただし、総意が偏っている場合は、少数派の意見も簡潔に含めてください。ただし，トピックのURLが存在しない場合は，SNSの投稿のみから意見を要約してください．
出力は2~3文にしてください。

SNSの投稿：
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

export async function fetchSummaryFromGemini(topic: string, posts: string[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  const apiUrl = import.meta.env.VITE_GEMINI_API_URL as string;

  const prompt = `
あなたは優秀な要約AIです。
以下のトピック「${topic}」に関する複数人の投稿があります。
それらを1つの要約文にしてください。

投稿：
${posts.map((p, i) => `投稿${i + 1}：${p}`).join('\n')}

要約：
  `;

  const response = await fetch(`${apiUrl}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });
  
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '要約に失敗しました';
  
}


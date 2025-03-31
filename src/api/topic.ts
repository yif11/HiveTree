export async function getTopic(): Promise<{ url: string; title: string }[]> {
	try {
		// API URL
		// GDELT APIを使用して日本語のトピックを取得
		// クエリは「Japan」、ソース言語は「Japanese」、ソース国は「Japan」
		// フォーマットは「jsonfeed」
		const apiURL =
			"https://api.gdeltproject.org/api/v2/geo/geo?query=Japan&sourcelang:japanese&sourcecountry:Japan&format=jsonfeed";
		// console.log("API URL:", apiURL);

		// APIリクエスト
		const response = await fetch(apiURL);
		// console.log("Response status:", response.status);

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}

		// レスポンスをJSONとして取得
		const data = await response.json();
		// console.log("Response data:", data);

		// items が存在するか確認、データの型の確認
		if (!data.items || !Array.isArray(data.items)) {
			console.error(
				"Error: 'items' property is missing or invalid in the response.",
			);
			return [];
		}

		// 記事データを抽出
		const firstItem = data.items[0];
		if (!firstItem || typeof firstItem !== "object") {
			console.error("Error: Invalid item structure.");
			return [];
		}
		return {
			url: firstItem.url || "No URL",
			title: firstItem.title || "No Title",
		};
	} catch (error) {
		console.error("Error fetching topics:", error);
		return [];
	}
}

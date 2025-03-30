export async function getTopic(): Promise<{ url: string; title: string }[]> {
	try {
		const apiURL =
			"https://api.gdeltproject.org/api/v2/geo/geo?query=Japan&sourcelang:japanese&sourcecountry:Japan&format=jsonfeed";
		console.log("API URL:", apiURL); //API URLの確認
		const response = await fetch(apiURL);
		console.log("Response status:", response.status); //レスポンスステータスの確認

		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		console.log("Response data:", data); //レスポンスデータの確認

		return data.features.map((item: any) => ({
			url: item.properties.url,
			title: item.properties.name,
		}));
	} catch (error) {
		console.error("Error fetching topics:", error);
	}
	return [];
}

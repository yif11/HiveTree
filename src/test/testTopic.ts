import { getTopic } from "../api/topic";

async function testGetTopic() {
	const topics = await getTopic();
	console.log("Fetched topics:", topics);
}

testGetTopic();

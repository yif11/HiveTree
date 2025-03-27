// src/test/testGemini.ts
import { fetchSummaryFromGemini } from '../api/gemini';

async function testGemini() {
  const topic = '未来の教育';
  const posts = [
    'AIが授業をする未来が来るかも。',
    'オンライン教育の可能性が広がっている。',
    '自宅で学ぶスタイルが主流になるかも。'
  ];

  try {
    const summary = await fetchSummaryFromGemini(topic, posts);
    console.log('🧠 要約結果：\n', summary);
  } catch (error) {
    console.error('❌ Gemini APIの呼び出しに失敗しました:', error);
  }
}

testGemini();

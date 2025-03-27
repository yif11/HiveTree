import type React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

//トピックを表示するコンポーネントの作成
const TopicComponent = () => {
  const [topics, setTopics] =useState([]); //型の指定に関して、今後確認必要？
  const [error, seterror] = useState<string |null>(null);

  useEffect(() => {
    
    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_URL = process.env.REACT_APP_API_URL;

    axios.get(`${API_URL}/topics?key=${API_KEY}`) //APIを叩く
      .then((res) => {
        setTopics(res.data);
      })
      //エラーハンドリング
      .catch((err) => {
        seterror(`トピックの表示に失敗しました: ${err.message}`); //具体的なエラーの表示
      });
      
  }, []);

  //エラーがある場合に表示
  if (error) {
    return <div>{error}</div>;
  }

  //トピックの表示、表示のみを行う
  return (
    <div>
      <h1>トピック</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>{topic.title}</li>
        ))}
      </ul>
    </div>
  );
}
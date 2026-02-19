'use client';

import { useState } from 'react';

export default function GeminiTest() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleClick = async () => {
    const res = await fetch('/api/gemini-api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt_post: prompt }),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="プロンプトを入力"
      />
      <button onClick={handleClick}>送信</button>
      <p>{response}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function RecipeExtractorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [ingredients, setIngredients] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoId = (() => {
    try {
      return new URL(youtubeUrl).searchParams.get('v') ?? '';
    } catch {
      return '';
    }
  })();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIngredients(null);

    // TODO: ここでバックエンドAPIを呼び出してYouTubeの動画情報（特に説明欄）から食材を抽出する
    // 現在は仮のデータを使用
    try {
      // 実際にはAPIエンドポイントを呼び出す
      // const response = await fetch('/api/extract-recipe', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ url: youtubeUrl }),
      // });

      // if (!response.ok) {
      //   throw new Error('レシピの抽出に失敗しました。');
      // }

      // const data = await response.json();
      // setIngredients(data.ingredients);

//       // --- 仮のデータ処理 ---
//       await new Promise(resolve => setTimeout(resolve, 1500)); // 擬似的なローディング
//       if (youtubeUrl.includes('error')) {
//         throw new Error('テスト用のエラーが発生しました。別のURLをお試しください。');
//       }
//       setIngredients([
//         '鶏もも肉: 300g',
//         '玉ねぎ: 1個',
//         'にんじん: 1本',
//         'じゃがいも: 2個',
//         'カレールー: 1箱',
//         '水: 800ml',
//         'サラダ油: 大さじ1',
//       ]);
//       // --- 仮のデータ処理ここまで ---

} catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError('不明なエラーが発生しました。');
  }
} finally {
  setIsLoading(false);
}
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTubeレシピ食材抽出</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <div className="mb-4">
          <label htmlFor="youtubeUrl" className="block text-gray-700 text-sm font-bold mb-2">
            YouTube動画URL:
          </label>
          <input
            type="url"
            id="youtubeUrl"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="例: https://www.youtube.com/watch?v=xxxxxxxx"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '抽出中...' : '食材を抽出'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-xs italic mt-4">{error}</p>
        )}
      </form>

      {ingredients && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-2xl font-bold mb-4">抽出された食材</h2>
          {ingredients.length > 0 ? (
            <ul className="list-disc pl-5">
              {ingredients.map((item, index) => (
                <li key={index} className="text-gray-700 mb-2">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">食材は検出されませんでした。</p>
          )}
        </div>
      )}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <p>{videoId}</p>
      </div>
    </div>
  );
}

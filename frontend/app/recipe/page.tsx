'use client';

import { useState, FormEvent } from 'react';

type Ingredient = {
  id: number;
  name: string;
  quantity: string;
};

type Recipe = {
  id: number;
  title: string;
  thumbnail_url: string;
  ingredients: Ingredient[];
};

export default function RecipeExtractorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoInfo, setVideo] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setVideo(null);
    setLoading(true);
    // ここでバックエンドのAPIにPOSTリクエストを送っている。
    try {
      const res = await fetch('http://localhost:3001/api/v1/recipes/youtube_api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_url: youtubeUrl }),
      });

      if (!res.ok) {
        throw new Error('取得に失敗しました');
      }

      const data = await res.json();
      setVideo(data);
    } catch {
      setError('取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const seachIngredients = (description: string) => {
    // 【材料】または 材料 から始まり、次のセクションの開始（【作り方】、■、httpなど）までの範囲を抽出
    const regex = /(?:【材料】|材料)[\s\S]*?(?=(?:【作り方】|作り方|■|http|$))/i;
    const match = description.match(regex);
    return match ? match[0].trim() : '材料セクションが見つかりませんでした。';
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        YouTubeレシピ食材抽出
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
      >
        <label className="block text-sm font-bold mb-2">
          YouTube動画URL
        </label>
        <input
          type="url"
          className="border rounded w-full py-2 px-3 mb-4"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          required
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? '取得中...' : '取得'}
        </button>
      </form>
      {videoInfo && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-bold mb-4">{videoInfo.title}</h2>

          <div className="p-4 bg-gray-50 border rounded">
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              抽出された材料
            </h3>

            <ul>
              {videoInfo.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {ingredient.name} - {ingredient.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

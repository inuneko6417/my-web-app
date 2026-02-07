'use client';

import { useState, FormEvent } from 'react';

type VideoSnippet = {
  title: string;
  description: string;
};

export default function RecipeExtractorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoInfo, setVideo] = useState<VideoSnippet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setVideo(null);
    setLoading(true);

    let videoId = '';

    try {
      videoId = new URL(youtubeUrl).searchParams.get('v') ?? '';
    } catch {
      setError('URLが不正です');
      setLoading(false);
      return;
    }
    if (!videoId) {
      setError('videoId を取得できません');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );
      const data = await res.json();
      setVideo(data.items[0].snippet);
    } catch {
      setError('取得に失敗しました');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-xl font-bold mb-2">{videoInfo.title}</h2>
          <p className="whitespace-pre-wrap">{videoInfo.description}</p>
        </div>
      )}
    </div>
  );
}

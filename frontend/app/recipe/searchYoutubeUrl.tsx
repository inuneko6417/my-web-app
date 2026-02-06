'use client';
import { useState } from 'react';

export default function SearchYoutubeUrl() {
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const videoId = (() => {
    try {
      return new URL(youtubeUrl).searchParams.get('v') ?? '';
    } catch {
      return '';
    }
  })();
  return (
    <div>
      <div className="mb-4">
        <label
          htmlFor="youtubeUrl"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
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
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <p>{videoId}</p>
      </div>
    </div>
  );
}

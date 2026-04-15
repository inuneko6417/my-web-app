"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";

type Ingredient = {
  id: number;
  name: string;
  quantity: string;
};

type Recipe = {
  id: number;
  title: string;
  thumbnail_url: string;
  video_id: string;
  ingredients: Ingredient[];
};

export default function RecipeExtractorPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoInfo, setVideo] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (videoInfo) {
      document.title = `${videoInfo.title} | RecipeTube`;
    } else {
      document.title = "Recipetube検索 | RecipeTube";
    }
  }, [videoInfo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setVideo(null);
    setLoading(true);
    // ここでバックエンドのAPIにPOSTリクエストを送っている。
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recipes/youtube_api`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ youtube_url: youtubeUrl }),
        },
      );

      if (!res.ok) {
        throw new Error("取得に失敗しました");
      }

      const data = await res.json();
      setVideo(data);
    } catch {
      setError("取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          YouTubeレシピ食材抽出
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8"
        >
          <label className="block text-sm font-bold mb-2">YouTube動画URL</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="border rounded w-full py-2 px-3 mb-4"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "取得中..." : "取得"}
          </button>
        </form>
        {videoInfo && (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 className="text-xl font-bold mb-4">{videoInfo.title}</h2>

            <div className="aspect-video mb-6">
              <iframe
                className="w-full h-full rounded"
                src={`https://www.youtube.com/embed/${videoInfo.video_id}`}
                title={videoInfo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <h3 className="font-bold text-lg mb-2 text-blue-600">
              抽出された材料
            </h3>
            <div className="p-4 bg-gray-50 border rounded">
              <div className="grid gap-3">
                {videoInfo.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="group relative flex items-center justify-between p-4 bg-white hover:bg-orange-50/50 border border-gray-100 rounded-2xl transition-all hover:border-orange-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 group-hover:scale-125 transition-transform" />
                      <span className="text-gray-800 font-semibold group-hover:text-orange-950 transition-colors">
                        {ingredient.name}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-orange-50 text-orange-400 text-xs font-bold rounded-lg border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      {ingredient.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

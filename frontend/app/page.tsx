"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Header />

      <main className="max-w-4xl px-4 text-center mt-16 md:mt-32">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-gray-900 leading-tight">
          YouTubeから、
          <br />
          <span className="text-red-600 font-black">レシピ</span>を一瞬で。
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-14 max-w-2xl mx-auto leading-relaxed">
          RecipeTubeは、YouTube動画のURLを入力するだけで、材料や分量をAIが自動で書き起こします。
        </p>
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/recipe"
            className="group relative inline-flex items-center justify-center px-12 py-6 text-2xl font-black text-white bg-red-600 rounded-full overflow-hidden transition-all hover:bg-red-700 hover:ring-4 hover:ring-red-100 shadow-2xl shadow-red-200 active:scale-95"
          >
            今すぐレシピを抽出する
            <svg
              className="w-8 h-8 ml-3 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              ></path>
            </svg>
          </Link>
          <p className="text-gray-400 text-sm font-medium">
            登録不要・今すぐ始められます
          </p>
        </div>
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          {[
            {
              title: "最速抽出",
              desc: "URLを貼るだけで材料リストが完成。",
              icon: "⚡",
            },
            { title: "正確な分量", desc: "動画の内容をAIに解析。", icon: "⚖️" },
            {
              title: "メモ帳いらず",
              desc: "一時停止を繰り返す必要はありません。",
              icon: "📝",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-5xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import SearchYoutubeUrl from './searchYoutubeUrl';

export default async function RecipeExtractorPage() {
  const youtubeDate = await fetchYoutubeDate();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        YouTubeレシピ食材抽出
      </h1>

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
        <div className="mb-4">
          <SearchYoutubeUrl />
        </div>
      </form>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
        <p>{youtubeDate.items[0].snippet.title}</p>
        <p>{youtubeDate.items[0].snippet.description}</p>
      </div>
    </div>
  );
}

export async function fetchYoutubeDate() {
  // const place = "Tokyo";
  try {
    console.log("データ取得中です...");
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&part=snippet&id=ZpWSPuqFNeI`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("データ取得エラー");
  }
}

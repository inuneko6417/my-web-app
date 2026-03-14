require "uri"
require "cgi"

class YoutubeRecipeExtractor
  YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos"
  GEMINI_API_URL  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

  def initialize(url)
    @url = url
    # URLからvideo_idを抽出して保持
    @video_id = extract_video_id(url)
  end

  # メインメソッド: URLを受け取りレシピをDBに保存して返す
  # 1 video_idが取得できない場合はnil
  # 2 既存レシピがあればそのまま返す
  # 3 YouTube APIで動画情報取得
  # 4 Geminiで材料抽出 → DB保存
  def extract_and_save!
    return nil unless @video_id
    return existing_recipe if existing_recipe

    details = fetch_youtube_details
    return nil unless details

    save_recipe(details)
  end

  private

  # DBに同じvideo_idのレシピが既に存在するか確認
  # ||= でメモ化し、同一インスタンス内でDBアクセスを1回に抑える
  def existing_recipe
    @existing_recipe ||= Recipe.find_by(video_id: @video_id)
  end

  # RecipeとIngredientsをトランザクションでまとめてDB保存
  # どちらかが失敗した場合はロールバックされる
  def save_recipe(details)
    ingredients = parse_ingredients(details[:description])

    Recipe.transaction do
      recipe = Recipe.create!(
        title:         details[:title],
        video_id:      @video_id,
        youtube_url:   @url,
        thumbnail_url: details[:thumbnail_url],
        steps:         details[:description]
      )
      # sliceでname/quantityのみ取り出して保存（余分なキーを除外）
      ingredients.each { |item| recipe.ingredients.create!(item.slice("name", "quantity")) }
      recipe
    end
  end

  # YouTubeのURLからvideo_idを抽出する
  # 対応フォーマット:
  #   https://youtu.be/ABC123
  #   https://www.youtube.com/watch?v=ABC123
  def extract_video_id(url)
    uri = URI.parse(url)
    return uri.path.delete_prefix("/") if uri.host == "youtu.be"
    CGI.parse(uri.query.to_s)["v"]&.first if uri.host&.include?("youtube.com")
  rescue URI::InvalidURIError
    nil
  end

  # YouTube Data APIを叩いて動画のタイトル・概要欄・サムネイルを取得
  # 取得失敗またはvideo_idが存在しない場合はnilを返す
  def fetch_youtube_details
    response = HTTParty.get(YOUTUBE_API_URL, query: {
      part: "snippet",
      id:   @video_id,
      key:  ENV["YOUTUBE_API_KEY"]
    })
    return nil unless response.success? && response["items"].present?

    snippet = response["items"].first["snippet"]
    {
      title:         snippet["title"],
      description:   snippet["description"],
      thumbnail_url: snippet.dig("thumbnails", "high", "url")
    }
  end

  # 概要欄のテキストをGemini AIに渡して材料一覧を抽出
  # 失敗した場合は空配列を返す（rescueで握り潰し）
  def parse_ingredients(description)
    response = HTTParty.post(
      "#{GEMINI_API_URL}?key=#{ENV["GEMINI_API_KEY"]}",
      headers: { "Content-Type" => "application/json" },
      body: build_gemini_body(description).to_json
    )
    return [] unless response.success?

    extract_ingredients_from(response)
  rescue
    []
  end

  # Gemini APIに送るリクエストボディを組み立てる
  # response_mime_typeをapplication/jsonにすることでJSON形式の返答を強制
  def build_gemini_body(description)
    {
      contents: [{ parts: [{ text: ingredients_prompt(description) }] }],
      generationConfig: { response_mime_type: "application/json" }
    }
  end

  # Geminiに渡すプロンプト
  # name（材料名）とquantity（分量）のペアをJSON形式で返すよう指示
  def ingredients_prompt(description)
    <<~PROMPT
      以下の文章から料理の材料と分量を抽出し、
      次のJSON形式のみで返してください。

      {"ingredients": [{"name": "材料名", "quantity": "分量"}]}

      #{description}
    PROMPT
  end

  # GeminiのレスポンスからJSONをパースしてingredientsの配列を返す
  # ```json ``` のようなmarkdownコードブロックが含まれる場合も除去して対応
  def extract_ingredients_from(response)
    content = response.dig("candidates", 0, "content", "parts", 0, "text")
    json = JSON.parse(content.gsub(/```json|```/, "").strip)
    json["ingredients"] || []
  end
end

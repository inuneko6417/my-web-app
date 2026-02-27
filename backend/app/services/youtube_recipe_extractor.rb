require "uri"
require "cgi"

class YoutubeRecipeExtractor
  YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos"
  GEMINI_API_URL  = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent"

  def initialize(url)
    @url = url
    @video_id = extract_video_id(url)
  end

  def extract_and_save!
    return nil unless @video_id

    # 既存チェック
    return Recipe.find_by(video_id: @video_id) if Recipe.exists?(video_id: @video_id)

    details = fetch_youtube_details
    return nil unless details

    ingredients = parse_ingredients(details[:description])

    Recipe.transaction do
      recipe = Recipe.create!(
        title: details[:title],
        video_id: @video_id,
        youtube_url: @url,
        thumbnail_url: details[:thumbnail_url],
        steps: details[:description]
      )

      ingredients.each do |item|
        recipe.ingredients.create!(
          name: item["name"],
          quantity: item["quantity"]
        )
      end

      recipe
    end
  end

  private

  def extract_video_id(url)
    uri = URI.parse(url)
    return uri.path.delete_prefix("/") if uri.host == "youtu.be"

    if uri.host&.include?("youtube.com")
      CGI.parse(uri.query.to_s)["v"]&.first
    end
  rescue URI::InvalidURIError
    nil
  end

  def fetch_youtube_details
    response = HTTParty.get(YOUTUBE_API_URL, query: {
      part: "snippet",
      id: @video_id,
      key: ENV["YOUTUBE_API_KEY"]
    })

    return nil unless response.success? && response["items"].present?

    snippet = response["items"].first["snippet"]

    {
      title: snippet["title"],
      description: snippet["description"],
      thumbnail_url: snippet.dig("thumbnails", "high", "url")
    }
  end

  def parse_ingredients(description)
    prompt = <<~PROMPT
      以下の文章から料理の材料と分量を抽出し、
      次のJSON形式のみで返してください。

      {
        "ingredients": [
          {"name": "材料名", "quantity": "分量"}
        ]
      }

      #{description}
    PROMPT

    response = HTTParty.post(
      "#{GEMINI_API_URL}?key=#{ENV["GEMINI_API_KEY"]}",
      headers: { "Content-Type" => "application/json" },
      body: {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: "application/json" }
      }.to_json
    )

    return [] unless response.success?

    content = response.dig("candidates", 0, "content", "parts", 0, "text")
    json = JSON.parse(content.gsub(/```json|```/, "").strip)

    json["ingredients"] || []
  rescue
    []
  end
end

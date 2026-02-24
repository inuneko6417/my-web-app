class YoutubeRecipeExtractor
  YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/videos"
  GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent"

  def initialize(url)
    @url = url
    @video_id = extract_video_id(url)
  end

  def extract_and_save!
    Rails.logger.info "Starting extraction for URL: #{@url}, Video ID: #{@video_id}"
    return nil unless @video_id

    # Check if recipe already exists
    recipe = Recipe.find_by(video_id: @video_id)
    if recipe
      Rails.logger.info "Recipe already exists: #{recipe.id}"
      return recipe
    end

    # Fetch YouTube Details
    details = fetch_youtube_details
    if details.nil?
      Rails.logger.error "Failed to fetch YouTube details for Video ID: #{@video_id}"
      return nil
    end

    # Parse ingredients from description using AI
    ingredients_data = parse_ingredients_with_ai(details[:description])
    Rails.logger.info "Parsed ingredients: #{ingredients_data.inspect}"

    # Save Recipe
    recipe = Recipe.create!(
      title: details[:title],
      video_id: @video_id,
      youtube_url: @url,
      thumbnail_url: details[:thumbnail_url],
      steps: details[:description]
    )

    # Save Ingredients
    ingredients_data.each do |ingredient|
      recipe.ingredients.create!(
        name: ingredient["name"],
        quantity: ingredient["quantity"]
      )
    end

    recipe
  rescue => e
    Rails.logger.error "Extraction failed: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    nil
  end

  private

  def extract_video_id(url)
    uri = URI.parse(url)
    if uri.host == 'youtu.be'
      uri.path[1..-1]
    elsif uri.host&.include?('youtube.com')
      CGI.parse(uri.query)["v"]&.first
    end
  rescue
    nil
  end

  def fetch_youtube_details
    response = HTTParty.get(YOUTUBE_API_URL, query: {
      part: "snippet",
      id: @video_id,
      key: ENV["YOUTUBE_API_KEY"]
    })

    return nil unless response.success? && response["items"].any?

    snippet = response["items"].first["snippet"]
    {
      title: snippet["title"],
      description: snippet["description"],
      thumbnail_url: snippet.dig("thumbnails", "high", "url") || snippet.dig("thumbnails", "default", "url")
    }
  end

  def parse_ingredients_with_ai(description)
    prompt = <<~PROMPT
      以下のYouTube動画の概要欄から、料理の食材とその分量を抽出してください。
      結果は以下のJSON形式のみで返してください。他のテキストは含めないでください。
      {
        "ingredients": [
          {"name": "食材名", "quantity": "分量"}
        ]
      }

      概要欄:
      #{description}
    PROMPT

    response = HTTParty.post(
      "#{GEMINI_API_URL}?key=#{ENV["GEMINI_API_KEY"]}",
      headers: { "Content-Type" => "application/json" },
      body: {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      }.to_json
    )

    if response.success?
      content = response.dig("candidates", 0, "content", "parts", 0, "text")
      parsed = JSON.parse(content)
      parsed["ingredients"] || parsed["results"] || parsed.values.find { |v| v.is_a?(Array) } || []
    else
      Rails.logger.error "Gemini API Error: #{response.body}"
      []
    end
  rescue => e
    Rails.logger.error "AI Parsing Error: #{e.message}"
    []
  end
end

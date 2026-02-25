require 'net/http'
require 'json'

class RecipeParser
  # Google AI Studioで取得したキー
  API_KEY = ENV['GEMINI_API_KEY']
  MODEL_ID = "gemini-2.0-flash-lite" # 最新の軽量・高速モデル
  API_URL = "https://generativelanguage.googleapis.com/v1beta/models/#{MODEL_ID}:generateContent?key=#{API_KEY}"

  def self.parse_ingredients(description)
    prompt = <<~TEXT
      以下の料理動画の概要欄から「材料」と「分量」を抽出し、JSON形式で返してください。
      【ルール】
      - 材料名(name)と分量(amount)のペアにすること。
      - 材料以外のテキスト（URLや挨拶、作り方の説明）はすべて除外すること。
      - 出力は必ず以下のJSONフォーマットのみにしてください。
      {"ingredients": [{"name": "材料A", "amount": "100g"}, {"name": "材料B", "amount": "2個"}]}

      テキスト:
      #{description}
    TEXT

    uri = URI.parse(API_URL)
    request = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
    request.body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" }
    }.to_json

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end

    # AIの回答をJSONとして取得
    result = JSON.parse(response.body)
    raw_json = result.dig("candidates", 0, "content", "parts", 0, "text")
    JSON.parse(raw_json)["ingredients"]
  end
end

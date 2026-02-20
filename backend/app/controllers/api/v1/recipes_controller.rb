class Api::V1::RecipesController < ApplicationController
  def youtube_api
    url = params[:youtube_url]
    return render json: { error: "youtube_url is required" }, status: :bad_request if url.blank?
    video_id = extract_video_id(url)
    recipe = Recipe.find_by(video_id: video_id)
    return render json: recipe if recipe

    # 仮データ（まずは動作確認用）
    recipe = Recipe.create!(
      title: "テストレシピ",
      video_id: video_id,
      youtube_url: url,
      thumbnail_url: "",
      steps: "手順1\n手順2"
    )

    render json: recipe
  end

  private

  def extract_video_id(url)
    uri = URI.parse(url)
    CGI.parse(uri.query)["v"]&.first
  rescue
    nil
  end
end

class Api::V1::RecipesController < ApplicationController
  # ここでyoutubeのURLを受け取り処理している。
  def youtube_api
    url = params[:youtube_url]
    return render json: { error: "youtube_url is required" }, status: :bad_request if url.blank?

    extractor = ::YoutubeRecipeExtractor.new(url)
    begin
      recipe = extractor.extract_and_save!
      if recipe
        render json: recipe.as_json(include: :ingredients)
      else
        render json: { error: "Failed to extract recipe. Please check Rails logs for details." }, status: :unprocessable_entity
      end
    rescue => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end

  private

  def extract_video_id(url)
    uri = URI.parse(url)
    CGI.parse(uri.query)["v"]&.first
  rescue
    nil
  end
end

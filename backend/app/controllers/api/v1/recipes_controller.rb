class Api::V1::RecipesController < ApplicationController
<<<<<<< HEAD
  # レシピと材料を同時に保存するAPI
  def create
    # 1. 概要欄をAIに渡して構造化データに変換
    # app/services/recipe_parser.rb 4行目を参照
    # backend/app/services/recipe_parser.rb 10行目を参照 parse_ingredients
=======
  def create
    # 1. 概要欄をAIに渡して構造化データに変換
>>>>>>> 27d3a1fe6875e4e892da9c421ec12f90cc651aba
    ingredients_data = RecipeParser.parse_ingredients(params[:description])

    # 2. RecipeとIngredientsを同時に保存
    @recipe = Recipe.new(recipe_params)

    if @recipe.save
      ingredients_data.each do |item|
        # ここで「食材ごと」にDB保存される
        @recipe.ingredients.create(name: item["name"], amount: item["amount"])
      end
      render json: @recipe, include: :ingredients, status: :created
    else
      render json: @recipe.errors, status: :unprocessable_entity
    end
  end

<<<<<<< HEAD
  # ここでyoutubeのURLを受け取り処理している。
=======
>>>>>>> 27d3a1fe6875e4e892da9c421ec12f90cc651aba
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

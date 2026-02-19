require "test_helper"

class Api::V1::RecipesControllerTest < ActionDispatch::IntegrationTest
  test "should get youtube_api" do
    get api_v1_recipes_youtube_api_url
    assert_response :success
  end
end

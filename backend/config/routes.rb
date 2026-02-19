Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  namespace :api do
    get 'time', to: 'time#index'
    post 'recipe/extract', to: 'recipe#extract'

    namespace :v1 do
      get "recipes/youtube_api"
      post "recipes/youtube_api", to: "recipes#youtube_api"
    end
  end
end

Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'

  namespace :agents do
    namespace :eci do
      get :search_offers
    end

    namespace :crf do
      get :search_offers
    end

    namespace :amz do
      get :search_offers
    end

    namespace :mmk do
      get :search_offers
    end

    namespace :ula do
      get :search_offers
    end
  end

  namespace :link_parser do
    post :get_search_term

    if Rails.env.development?
      get :get_search_term
    end
  end

  resources :search_lists, only: [:update, :create] do

  end

  match '/l/*path' => 'home#index', via: [:get]
end

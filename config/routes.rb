Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'home#index'

  namespace :agents do
    namespace :eci do
      get :search_offers
    end

    namespace :crf do
      get :search_offers
    end
  end

  # match '*path' => 'home#index', via: [:get]
end

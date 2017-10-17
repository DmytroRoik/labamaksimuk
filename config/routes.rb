Rails.application.routes.draw do
  get 'laba2/index'

  devise_for :users
  resources :laba1
	root 'laba1#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end

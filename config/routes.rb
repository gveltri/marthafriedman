Rails.application.routes.draw do
  
  root 'home#index'

  get '/work', to: 'home#image_gallery'
  get '/about', to: 'home#about'
  get '/cv', to: 'home#cv'

end

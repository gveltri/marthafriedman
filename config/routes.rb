Rails.application.routes.draw do
  
  root 'home#index'

  get '/3dgallery', to: 'home#index', as: 'threed'
  get '/work', to: 'page#image_gallery'
  get '/about', to: 'page#about'
  get '/cv', to: 'page#cv'

end

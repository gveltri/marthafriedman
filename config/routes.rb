Rails.application.routes.draw do
  
  authenticated :admin do 
    resources :works do
      put :sort, on: :collection
    end
    get '/work_order', to:'works#work_order', as: 'work_order'
    resources :information
  end
  
  devise_for :admins, controllers: { sessions: "admin/sessions", registrations: "admin/registrations" }
  
  root 'home#index'

  get '/3dgallery', to: 'home#index', as: 'threed'
  get '/work', to: 'page#image_gallery'
  get '/about', to: 'page#about'
  get '/cv', to: 'page#cv'

end

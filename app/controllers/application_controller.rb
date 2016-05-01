class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_filter :set_cv

  def set_cv
    if (Information.all.size > 0)
      @cv = Information.last.document.url
    else
      @cv = '/'
    end
  end

end

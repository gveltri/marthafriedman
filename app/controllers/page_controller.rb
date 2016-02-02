class PageController < ApplicationController
  
  def image_gallery
    @works = Work.ordered_works
  end

  def about
  end

  def cv
  end

end

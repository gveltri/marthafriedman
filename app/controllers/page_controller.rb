class PageController < ApplicationController
  
  def image_gallery
    @works = Work.ordered_works
  end

  def about
    @about = Information.last.about
  end

  def cv
  end

end

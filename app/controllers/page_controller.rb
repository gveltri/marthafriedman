class PageController < ApplicationController
  
  def image_gallery
    @works = Work.ordered_works
  end

  def about
    if (Information.size > 0)
      @about = Information.last.about
    else
      @about = "No description has been registered."
  end

  def cv
  end

end

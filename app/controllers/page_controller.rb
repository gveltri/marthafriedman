class PageController < ApplicationController
  
  def image_gallery
    @works = Work.ordered_works
  end

  def about
    if (Information.all.size > 0)
      @about = Information.last.about
    else
      @about = "No description has been registered."
    end
  end

  def cv
  end

  def press
    if (Information.all.size > 0)
      @information = Information.last
      @press = @information.press
      @press_documents = @information.press_documents
    else
      @press = "No press information has been registered."
    end

  end

end

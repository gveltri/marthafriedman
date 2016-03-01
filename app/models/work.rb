class Work < ActiveRecord::Base
  after_destroy :reorder_works

  validates_presence_of :image, :name, :year, :message => "missing, fill in ya shit dummy."
  
  has_attached_file :image, styles: lambda { |a|
    a.instance.is_image? ? { medium: "1800x1000>", thumb: "300x300>", tiny_thumb: "50x50>" } :
      { :medium => { :geometry => "640x480>", :format => 'mp4' },
        :thumb => { :geometry => "300x300>", :format => 'jpg', :time => 2},
        :tiny_thumb => {:geometry => "50x50>", :format => 'jpg', :time => 2}}},
                    :processors => lambda { |a| a.is_video? ? [:transcoder] : [ :thumbnail ] }
  
  validates_attachment_content_type :image,
                       content_type: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
                       message:      "Different error message",
                       if:           :is_image?


  validates_attachment_content_type :image,
                       content_type: ['video/mp4'],
                       message:      "Sorry, right now we only support MP4 video",
                       if:           :is_video?

  def self.ordered_works
    Work.all.order(:order)
  end

  def is_video?
    image.instance.image_content_type =~ %r(video)
  end

  def is_image?
    image.instance.image_content_type =~ %r(image)
  end


  private

  def reorder_works
    works = Work.ordered_works
    works.each_with_index do |work, i|
      work.update({order: i+1})
    end
  end

  
end

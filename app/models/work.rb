class Work < ActiveRecord::Base
  after_destroy :reorder_works

  validates_presence_of :image, :name, :year, :message => "missing, fill in ya shit dummy."

  has_attached_file :image, styles: { medium: "700x700>", thumb: "300x300>", tiny_thumb: "50x50>" }, default_url: "/images/:style/missing.png"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  def self.ordered_works
    Work.all.order(:order)
  end

  private

  def reorder_works
    works = Work.ordered_works
    works.each_with_index do |work, i|
      work.update({order: i+1})
    end
  end
  
end

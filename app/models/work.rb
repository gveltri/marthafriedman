class Work < ActiveRecord::Base
  after_destroy :reorder_works

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

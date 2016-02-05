class Information < ActiveRecord::Base

  has_attached_file :document
  validates_attachment :document, :content_type => { :content_type => %w(application/pdf) }
  validates_presence_of :document, :about, :version

end

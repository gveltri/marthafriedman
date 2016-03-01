class Information < ActiveRecord::Base
  has_many :press_documents
  accepts_nested_attributes_for :press_documents
  
  has_attached_file :document
  validates_attachment :document, :content_type => { :content_type => %w(application/pdf) }
  validates_presence_of :document, :about, :version, :press

end

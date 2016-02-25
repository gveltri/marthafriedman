class PressDocument < ActiveRecord::Base
  belongs_to :information

  has_attached_file :pdf
  validates_attachment :pdf, :content_type => { :content_type => %w(application/pdf) }
  validates_presence_of :pdf, :about, :version, :press

end

class AddAttachmentDocumentToInformation < ActiveRecord::Migration
  def self.up
    change_table :information do |t|
      t.attachment :document
    end
  end

  def self.down
    remove_attachment :information, :document
  end
end

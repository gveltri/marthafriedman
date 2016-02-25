class CreatePressDocuments < ActiveRecord::Migration
  def change
    create_table :press_documents do |t|
      t.attachment :pdf
      t.references :information, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

class AddNameToPressDocument < ActiveRecord::Migration
  def change
    change_table :press_documents do |t|
      t.string :name
    end
  end
end

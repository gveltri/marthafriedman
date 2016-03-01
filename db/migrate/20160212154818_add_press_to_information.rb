class AddPressToInformation < ActiveRecord::Migration
  def change
    change_table :information do |t|
      t.text :press
    end
  end
end

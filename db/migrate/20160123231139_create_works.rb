class CreateWorks < ActiveRecord::Migration
  def change
    create_table :works do |t|
      t.string :name
      t.integer :year
      t.integer :order

      t.timestamps null: false
    end
  end
end

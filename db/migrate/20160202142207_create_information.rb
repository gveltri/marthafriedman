class CreateInformation < ActiveRecord::Migration
  def change
    create_table :information do |t|
      t.string :version
      t.text :about

      t.timestamps null: false
    end
  end
end

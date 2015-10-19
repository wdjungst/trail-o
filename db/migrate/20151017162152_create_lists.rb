class CreateLists < ActiveRecord::Migration
  def change
    create_table :lists do |t|
      t.string :name
      t.integer :priority, limit: 5

      t.timestamps null: false
    end
  end
end

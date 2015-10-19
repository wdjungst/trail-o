class CreateCards < ActiveRecord::Migration
  def change
    create_table :cards do |t|
      t.string :title
      t.text :body
      t.integer :priority
      t.belongs_to :list, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end

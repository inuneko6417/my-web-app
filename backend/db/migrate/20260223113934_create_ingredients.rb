class CreateIngredients < ActiveRecord::Migration[8.1]
  def change
    create_table :ingredients do |t|
      t.references :recipe, null: false, foreign_key: true
      t.string :name
      t.string :quantity

      t.timestamps
    end
  end
end

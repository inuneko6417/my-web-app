class CreateRecipes < ActiveRecord::Migration[8.1]
  def change
    create_table :recipes do |t|
      t.string :title
      t.string :video_id
      t.string :youtube_url
      t.string :thumbnail_url
      t.text :steps

      t.timestamps
    end
    add_index :recipes, :video_id, unique: true
  end
end

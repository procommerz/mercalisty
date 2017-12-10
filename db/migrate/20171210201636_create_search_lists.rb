class CreateSearchLists < ActiveRecord::Migration[5.1]
  def change
    create_table :search_lists do |t|
      t.integer :user_id, index: true
      t.string :token, index: true
      t.integer :queries, array: true
      t.jsonb :results_data
      t.timestamps
    end
  end
end

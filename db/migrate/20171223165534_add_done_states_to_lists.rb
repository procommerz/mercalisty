class AddDoneStatesToLists < ActiveRecord::Migration[5.1]
  def change
    add_column :search_lists, :done_states, :boolean, array: true
    add_column :search_lists, :like_count, :integer, default: 0, index: true
    add_column :search_lists, :remix_count, :integer, default: 0, index: true
    add_column :search_lists, :view_count, :integer, default: 0, index: true
  end
end

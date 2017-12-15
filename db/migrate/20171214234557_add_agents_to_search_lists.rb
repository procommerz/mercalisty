class AddAgentsToSearchLists < ActiveRecord::Migration[5.1]
  def change
    add_column :search_lists, :agents, :string, array: true
  end
end

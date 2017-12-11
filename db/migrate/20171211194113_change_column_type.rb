class ChangeColumnType < ActiveRecord::Migration[5.1]
  def change
    remove_column :search_lists, :queries
    commit_db_transaction

    add_column :search_lists, :queries, :string, array: true, index: true
  end
end

class AddUserData < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :image_url, :string
    add_column :users, :profile_url, :string
  end
end

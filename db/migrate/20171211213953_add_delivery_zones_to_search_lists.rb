class AddDeliveryZonesToSearchLists < ActiveRecord::Migration[5.1]
  def change
    add_column :search_lists, :delivery_zone, :string
    add_column :search_lists, :zipcode, :string
  end
end

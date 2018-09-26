class CreateProductsAndOffers < ActiveRecord::Migration[5.1]
  def change
    create_table :brands do |t|
      t.string :name, index: true
      t.string :name_variations, array: true, index: true
      t.timestamps
    end

    create_table :products do |t|
      t.string :name, index: true
      t.string :name_variations, array: true, index: true
      t.string :external_taxon_names, array: true
      t.integer :brand_id, index: true
      t.timestamps
    end

    add_column :offers, :product_id, :integer, index: true
    add_column :offers, :expired_on, :datetime, index: true
    add_column :offers, :quantity_modifier, :float

    add_column :search_lists, :product_ids, :integer, array: true
    add_column :search_lists, :offer_ids, :integer, array: true
  end
end

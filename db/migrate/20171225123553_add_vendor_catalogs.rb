class AddVendorCatalogs < ActiveRecord::Migration[5.1]
  def change
    create_table :agents do |t|
      t.string :name
      t.string :code
      t.string :site_url
      t.string :query_template
      t.boolean :synthetic
      t.timestamps
    end

    create_table :queries do |t|
      t.string :keywords, index: true
      t.string :tokenized_keywords, array: true, index: true
      t.timestamp :created_at
    end

    create_table :offers do |t|
      t.integer :agent_id, index: true
      t.integer :taxon_id, index: true
      t.string :name
      t.string :agent_url
      t.string :price_text
      t.decimal :price_numeric, precision: 12, scale: 2
      t.timestamps
    end

    create_table :queries_offers do |t|
      t.integer :query_id, index: true
      t.integer :offer_id, index: true
    end

    create_table :offer_prices do |t|
      t.integer :offer_id
      t.string :price_text
      t.decimal :price_numeric, precision: 12, scale: 2
      t.string :stock, index: true
      t.timestamp :updated_at, index: true
    end
    add_index :offer_prices, [:offer_id, :updated_at]

    create_table :taxons do |t|
      t.integer :agent_id, index: true
      t.string :name
      t.timestamps
    end
  end
end

class AddFocusedOffersToSearchLsits < ActiveRecord::Migration[5.1]
  def change
    add_column :search_lists, :focused_offers, :jsonb
  end
end

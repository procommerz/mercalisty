# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180121212833) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "agents", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.string "site_url"
    t.string "query_template"
    t.boolean "synthetic"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "jwt_blacklist", force: :cascade do |t|
    t.string "jti", null: false
    t.datetime "exp", null: false
    t.index ["jti"], name: "index_jwt_blacklist_on_jti"
  end

  create_table "offer_prices", force: :cascade do |t|
    t.integer "offer_id"
    t.string "price_text"
    t.decimal "price_numeric", precision: 12, scale: 2
    t.string "stock"
    t.datetime "updated_at"
    t.index ["offer_id", "updated_at"], name: "index_offer_prices_on_offer_id_and_updated_at"
    t.index ["stock"], name: "index_offer_prices_on_stock"
    t.index ["updated_at"], name: "index_offer_prices_on_updated_at"
  end

  create_table "offers", force: :cascade do |t|
    t.integer "agent_id"
    t.integer "taxon_id"
    t.string "name"
    t.string "agent_url"
    t.string "price_text"
    t.decimal "price_numeric", precision: 12, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["agent_id"], name: "index_offers_on_agent_id"
    t.index ["taxon_id"], name: "index_offers_on_taxon_id"
  end

  create_table "queries", force: :cascade do |t|
    t.string "keywords"
    t.string "tokenized_keywords", array: true
    t.datetime "created_at"
    t.index ["keywords"], name: "index_queries_on_keywords"
    t.index ["tokenized_keywords"], name: "index_queries_on_tokenized_keywords"
  end

  create_table "queries_offers", force: :cascade do |t|
    t.integer "query_id"
    t.integer "offer_id"
    t.index ["offer_id"], name: "index_queries_offers_on_offer_id"
    t.index ["query_id"], name: "index_queries_offers_on_query_id"
  end

  create_table "search_lists", force: :cascade do |t|
    t.integer "user_id"
    t.string "token"
    t.jsonb "results_data"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "queries", array: true
    t.string "delivery_zone"
    t.string "zipcode"
    t.jsonb "focused_offers"
    t.string "agents", array: true
    t.boolean "done_states", array: true
    t.integer "like_count", default: 0
    t.integer "remix_count", default: 0
    t.integer "view_count", default: 0
    t.index ["token"], name: "index_search_lists_on_token"
    t.index ["user_id"], name: "index_search_lists_on_user_id"
  end

  create_table "taxons", force: :cascade do |t|
    t.integer "agent_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["agent_id"], name: "index_taxons_on_agent_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "image_url"
    t.string "profile_url"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end

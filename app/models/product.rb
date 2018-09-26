class Product < ActiveRecord::Base
  has_many :offers
  belongs_to :brand
end
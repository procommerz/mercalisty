class Taxon < ActiveRecord::Base
  has_many :offers
end
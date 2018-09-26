class Offer < ActiveRecord::Base
  belongs_to :product
  belongs_to :brand, through: :product

  def agent
    agent_id ? agent_id.constantize.new : nil
  end
end
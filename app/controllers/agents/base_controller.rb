class Agents::BaseController < ApplicationController
  def search_offers
    agent = Agent::Adapter::Amz.new

    begin
      offers = agent.search_offers(params[:query], params)

      render json: {
          provider: 'amz',
          search_url: agent.search_url,
          offers: offers
      }
    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end
end
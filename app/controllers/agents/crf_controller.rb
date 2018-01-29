require 'open-uri'

class Agents::CrfController < Agents::BaseController
  def search_offers
    agent = Agent::Adapter::Crf.new

    begin
      offers = agent.search_offers(params[:query], params)

      render json: {
          provider: 'crf',
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
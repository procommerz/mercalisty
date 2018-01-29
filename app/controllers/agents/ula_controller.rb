require 'open-uri'

class Agents::UlaController < Agents::BaseController
  def search_offers
    agent = Agent::Adapter::Ula.new

    begin
      offers = agent.search_offers(params[:query], params)

      render json: {
          provider: 'ula',
          search_url: agent.search_url,
          offers: offers
      }
    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end

  protected
end
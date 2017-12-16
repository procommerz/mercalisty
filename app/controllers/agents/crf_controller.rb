require 'open-uri'

class Agents::CrfController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id] || '010974'
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.carrefour.es/supermercado/browse?Ntt=#{query}&sb=true"

    begin
      body = open(url).read

      page = Nokogiri::HTML(body)

      offers = get_offers_from_agent_results(page)

      render json: {
          provider: 'crf',
          offers: offers
      }

    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end

  protected

  def get_offers_from_agent_results(page)
    offers = []

    item_nodes = page.css('article.item')

    item_nodes.map { |node|
      offers << JsonModel::Offer.from_crf_html_node(node)
    }

    offers
  end
end
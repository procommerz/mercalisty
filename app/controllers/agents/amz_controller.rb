require 'open-uri'

class Agents::AmzController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id]
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.amazon.es/s/ref=nb_sb_noss_2/257-2604327-1017544?__mk_es_ES=%C3%85M%C3%85%C5%BD%C3%95%C3%91&url=search-alias%3Daps&field-keywords=#{query}"

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

    item_nodes = page.css('#atfResults .s-result-item')

    item_nodes.map { |node|
      offers << JsonModel::Offer.from_amz_html_node(node)
    }

    offers
  end
end
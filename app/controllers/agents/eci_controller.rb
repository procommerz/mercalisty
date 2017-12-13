require 'open-uri'

class Agents::EciController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id] || '010974'
    per_page = 50

    url = "https://beta.elcorteingles.es/alimentacion/api/catalog/supermercado/type_ahead/?question=#{query}&scope=supermarket&center=#{zone_id}&results=#{per_page}"

    begin
      body = open(url).read

      data = JSON.parse(body)

      offers = get_offers_from_agent_results(data)

      render json: {
          provider: 'eci',
          offers: offers
      }

    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end

  protected

  def get_offers_from_agent_results(json)
    offers = []

    if json['catalog_result']['products_list'] and json['catalog_result']['products_list']['items']
      json['catalog_result']['products_list']['items'].map { |item|
        offers << JsonModel::Offer.from_eci_json(item)
      }
    end

    offers
  end
end
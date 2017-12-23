require 'open-uri'

class Agents::UlaController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id]
    per_page = 10

    query = CGI.escape(query)
    url = "https://www.ulabox.com/busca?q=#{query}&limit=#{per_page}"

    offers = []

    begin
      body = open(url, "accept" => "application/json, text/javascript, */*; q=0.01", "x-requested-with" => "XMLHttpRequest").read

      data = JSON.parse(body)

      if data['products']
        data['products'].each { |node|
          offers << JsonModel::Offer.from_ula_json(node)
        }
      end

      render json: {
          provider: 'ula',
          search_url: url,
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
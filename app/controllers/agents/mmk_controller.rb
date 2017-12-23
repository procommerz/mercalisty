require 'open-uri'

class Agents::MmkController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id]
    per_page = 24

    query = CGI.escape(query)
    url = "https://api.empathybroker.com/search/v1/query/mediamarkt/search?jsonCallback=angular.callbacks._0&lang=es&origin=linked&q=#{query}&rows=#{per_page}&scope=desktop&session=&start=0&user=&user_type=new"

    offers = []

    begin
      body = open(url).read

      body = body.gsub("angular.callbacks._0(", '')
      body = body[0..(body.size - 2)] # also strip the last parentheses

      data = JSON.parse(body)

      if data['content'] and data['content']['docs']
        data['content']['docs'].each { |node|
          offers << JsonModel::Offer.from_mmk_json(node)
        }
      end

      render json: {
          provider: 'mmk',
          search_url: url,
          offers: offers
      }
    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end
end
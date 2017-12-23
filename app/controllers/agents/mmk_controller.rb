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

  def process_page(url, pagenum)
    offers = []

    agent.get(url + "&page=#{pagenum}") { |page|
      offers = get_offers_from_agent_results(page)
    }

    offers
  end

  def agent
    @agent ||= Mechanize.new { |agent|
      agent.user_agent_alias = 'Mac Safari'
      agent.follow_meta_refresh = true
      # agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    }
  end

  protected

end
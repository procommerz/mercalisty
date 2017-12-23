require 'open-uri'

class Agents::AmzController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id]
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.amazon.es/s/?url=search-alias%3Daps&field-keywords=#{query}"

    offers = []

    begin
      offers += process_page(url, 1)
      sleep(1)

      begin
        offers += process_page(url, 2)
      rescue => e
        puts e.to_s
        puts e.backtrace.join("\n")
      end

      render json: {
          provider: 'amz',
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

  def get_offers_from_agent_results(page)
    offers = []

    item_nodes = page.css('.s-result-item')

    item_nodes.map { |node|
      offers << JsonModel::Offer.from_amz_html_node(node)
    }

    offers
  end
end
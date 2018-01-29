class Agent::Adapter::Amz < Agent::Adapter::Base
  def search_offers(keywords, params = {})
    query = keywords.to_s.downcase
    zone_id = params[:zone_id]
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.amazon.es/s/?url=search-alias%3Daps&field-keywords=#{query}"

    will_process(query, url)

    offers = []

    offers += process_page(url, 1)
    sleep(1)
    offers += process_page(url, 2)

    offers
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

    if page.css('#merchandised-content').size > 0
      item_nodes = page.css('.a-carousel-viewport .a-carousel')
    else
      item_nodes = page.css('.s-result-item')
    end

    item_nodes.map { |node|
      offers << JsonModel::Offer.from_amz_html_node(node)
    }

    offers
  end
end
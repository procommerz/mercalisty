require 'open-uri'

class Agent::Adapter::Eci < Agent::Adapter::Base
  def search_offers(keywords, params = {})
    query = keywords.to_s.downcase
    params ||= {}
    zone_id = params[:zone_id] || '010974'
    per_page = 50

    query = CGI.escape(query)

    url = "https://www.elcorteingles.es/alimentacion/api/catalog/supermercado/type_ahead/?question=#{query}&scope=supermarket&center=#{zone_id}&results=#{per_page}"

    will_process(query, url)

    agent = self.agent
    agent.visit(url)
    page = agent.text

    # body = open(url).read
    # json = JSON.parse(body)
    json = JSON.parse(page)

    offers = []

    if json['catalog_result']['products_list'] and json['catalog_result']['products_list']['items']
      json['catalog_result']['products_list']['items'].map { |item|
        offers << build_offer(item)
      }
    end

    offers
  ensure
    agent.try(:driver).try(:quit) if defined?(agent)
  end

  protected

  def agent
    agent = Capybara::Session.new(:poltergeist)
    agent.driver.headers = {
        "User-Agent" => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15",
        "Referer" => "https://www.bloomberg.com/search?query=",
        "Accept" => "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-language" => "en-US,en;q=0.9,es-ES;q=0.8,es;q=0.7,de;q=0.6",
        "Cache-control" => "max-age=0",
        "DNT" => 1,
        "upgrade-insecure-requests" => 1
    }
    agent
  end

  def build_offer(params)
    product_node = params['product']

    offer = JsonModel::Offer.new({ name: product_node['name'][0], agent_id: product_node['id'][0],
                       thumb_url: product_node['media']['thumbnail_url'], image_url: product_node['media']['thumbnail_url'].gsub("40x40", "600x600") })

    # Price arrives in format of ['1', '99'] for 1.99
    offer.price = BigDecimal.new(product_node['price']['price'][0] + "." + product_node['price']['price'][1])

    if product_node['price']['original_price']
      offer.old_price = BigDecimal.new(product_node['price']['original_price'][0] + "." + product_node['price']['original_price'][1])
    end

    offer.agent_url = "https://www.elcorteingles.es" + product_node['pdp_url']
    offer.price_per_kilo = product_node['price']['pum_price'].to_s.gsub('&euro;', '€')
    offer.price_per_kilo << '€ / Kg' if offer.price_per_kilo.downcase[/kg|kilo|litr/].nil?

    offer
  end
end
require 'open-uri'

class Agent::Adapter::Ula < Agent::Adapter::Base
  def search_offers(keywords, params = {})
    query = keywords.to_s.downcase
    per_page = 10

    query = CGI.escape(query)
    url = "https://www.ulabox.com/busca?q=#{query}&limit=#{per_page}"

    will_process(query, url)

    offers = []

    body = open(url, "accept" => "application/json, text/javascript, */*; q=0.01", "x-requested-with" => "XMLHttpRequest").read

    data = JSON.parse(body)

    if data['products']
      data['products'].each { |node|
        offers << JsonModel::Offer.from_ula_json(node)
      }
    end

    offers
  end
end
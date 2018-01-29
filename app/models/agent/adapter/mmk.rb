class Agent::Adapter::Mmk < Agent::Adapter::Base
  def search_offers(query, params = {})
    query = query.to_s.downcase
    per_page = 24

    query = CGI.escape(query)
    url = "https://api.empathybroker.com/search/v1/query/mediamarkt/search?jsonCallback=angular.callbacks._0&lang=es&origin=linked&q=#{query}&rows=#{per_page}&scope=desktop&session=&start=0&user=&user_type=new"

    will_process(query, url)

    offers = []

    body = open(url).read

    body = body.gsub("angular.callbacks._0(", '')
    body = body[0..(body.size - 2)] # also strip the last parentheses

    data = JSON.parse(body)

    if data['content'] and data['content']['docs']
      data['content']['docs'].each { |node|
        offers << JsonModel::Offer.from_mmk_json(node)
      }
    end

    offers
  end
end
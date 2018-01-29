class Agent::Adapter::Base
  def search_offers(keywords, params = {})

  end

  def search_url
    @search_url
  end

  def will_process(keywords, search_url)
    puts "[SEARCH] (#{keywords}): #{search_url}"
  end
end
module AgentsTestHelper
  def assert_offers(offers, keywords = "agua", name_check = "agua")
    assert(offers.size > 0, "No offers were received")
    assert(!offers[0].name.to_s.blank?, "Offer name is empty: #{offers[0].to_json}")
    assert(offers[0].name.to_s.downcase[name_check] != nil, "Offer name looks suspicious: #{offers[0].name}")
    assert(is_number?(offers[0].price), "Price is not a number")
    assert(offers[0].price > 0, "Price is zero")
    assert(offers[0].agent_url.to_s['/'], "Offer URL not found: #{offers[0].to_json}")
    assert(offers[0].image_url.to_s['/'], "Image URL not found")
  end
end
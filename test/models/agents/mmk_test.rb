require 'test_helper'
require 'helpers/agents_test_helper'
require 'open-uri'

class Agents::MmkAdapterTest < ActiveSupport::TestCase
  include AgentsTestHelper

  test "offer_fetch" do
    offers = agent.search_offers("impresoras")
    assert_offers(offers, "impresoras", "impresora")
  end

  def agent
    @agent = Agent::Adapter::Mmk.new
  end
end

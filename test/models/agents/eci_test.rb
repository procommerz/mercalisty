require 'test_helper'
require 'helpers/agents_test_helper'

class Agents::EciAdapterTest < ActiveSupport::TestCase
  include AgentsTestHelper

  test "offer_fetch" do
    offers = agent.search_offers("agua")
    assert_offers(offers)
  end

  def agent
    @agent = Agent::Adapter::Eci.new
  end
end

require 'test_helper'
require 'helpers/agents_test_helper'

class Agents::AmzAdapterTest < ActiveSupport::TestCase
  include AgentsTestHelper

  test "offer_fetch" do
    offers = agent.search_offers("tele")
    assert_offers(offers, "tele", "televisor")
  end

  def agent
    @agent = Agent::Adapter::Amz.new
  end
end

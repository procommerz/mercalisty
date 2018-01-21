require 'open-uri'

class Agents::CrfController < Agents::BaseController
  def search_offers
    query = params[:query].to_s.downcase
    zone_id = params[:zone_id] || '010974'
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.carrefour.es/supermercado/c?Ntt=#{query}&sb=true"

    offers = nil

    begin
      # body = open(url).read
      body = get_pjs_result(url)

      page = Nokogiri::HTML(body)
      offers = get_offers_from_agent_results(page)

      # agent.get(url) { |page|
      #   puts page.body.to_s
      #   offers = get_offers_from_agent_results(page)
      # }

      render json: {
          provider: 'crf',
          offers: offers
      }

    rescue => e
      puts e.to_s
      puts e.backtrace.join("\n")

      render json: { exception: e.to_s }
    end
  end

  protected

  def agent
    @agent ||= Mechanize.new { |agent|
      agent.user_agent_alias = 'Mac Safari'
      agent.follow_meta_refresh = false
      # agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    }
  end

  def get_offers_from_agent_results(page)
    offers = []

    item_nodes = page.css('article.item')

    item_nodes.map { |node|
      offers << JsonModel::Offer.from_crf_html_node(node)
    }

    offers
  end

  def get_pjs_result(url)
    tmpscript = "tmp/pjs_tmp_#{17645 + rand(1000000)}.js"
    result = ""

    script = "var page = require('webpage').create();
    var fs = require('fs');
    page.open('#{url}', function(status) {
      if(status === \"success\") {
          //page.render('tmp/screenshot.png');
          fs.write('#{tmpscript}.html', page.content, 'w');
      }
      phantom.exit();
    });"


    begin
      File.open(tmpscript, "w") { |f| f.write(script) }
      `#{Phantomjs.path + " " + tmpscript}` # execute the pjs script
      File.open(tmpscript + ".html", "r") { |f| result = f.read } # read the result
    ensure
      File.unlink(tmpscript)
      File.unlink(tmpscript + ".html")
    end

    result
  end
end
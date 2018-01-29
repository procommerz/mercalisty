class Agent::Adapter::Crf < Agent::Adapter::Base
  def search_offers(keywords, params = {})
    query = keywords.to_s.downcase
    zone_id = params[:zone_id] || '010974'
    per_page = 14

    query = CGI.escape(query)
    url = "https://www.carrefour.es/supermercado/c?Ntt=#{query}&sb=true"

    will_process(query, url)

    body = get_pjs_result(url)

    page = Nokogiri::HTML(body)
    offers = get_offers_from_html(page)

    offers
  end

  def get_offers_from_html(page)
    offers = []

    item_nodes = page.css('.content-product-inner article.item')

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
    page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_2) AppleWebKit/511.12 (KHTML, like Gecko) Chrome/63.0.3048.22 Safari/511.12';
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
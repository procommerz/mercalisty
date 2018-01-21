class LinkParserController < ApplicationController
  # [POST]
  def get_search_term
    link = params[:link]

    currency = 'EUR'

    offer = OpenStruct.new(name: '-', price: nil, numeric_price: nil, image: '-', currency: currency, agent_url: link)

    body = get_pjs_result(link)
    page = Nokogiri::HTML(body)

    # agent.get(link) { |page|
    css_classes = []
    num = 0

    sensible_page_title = page.css('head title').text.split(/–|\-|\||\:/).map(&:squish).last rescue nil

    possible_product_nodes = []
    page.root.traverse { |node|
      classes = node.attribute("class").to_s.downcase

      if classes["product"] || classes["produkt"]
        possible_product_nodes.push(node)
      end
    }

    name_nodes = []
    image_nodes = []
    price_nodes = []

    possible_product_nodes.each { |n|
      # Name
      name_nodes.push(n) if n.name == 'h1' || n.attribute('class').to_s.downcase[/h1|name|title/]

      # Image
      if n.name == 'img'
        image_nodes.push(n)
      elsif n.css('img').any?
        image_nodes += n.css('img').to_a
      end

      # Price
      price_classes = ['price', 'precio', 'product-price', 'produce_price']
      price_nodes.push(n) if n.attribute('class').to_s.downcase[/#{price_classes.join('|')}/]
      price_classes.each { |c|
        price_nodes += n.css(c).to_a
      }
    }

    # title_candidates = possible_product_nodes

    if page.css('h1').size == 1
      offer.name = page.css('h1').first.text.squish
    else
      # Try to inflect from product nodes
      if name_nodes.any?
        offer.name = name_nodes.first.text.to_s.squish
      else
        offer.name = sensible_page_title
      end
    end

    if image_nodes.any?
      offer.image = image_nodes.first.attributes['src'].to_s + "&"
    end

    if price_nodes.any?
      offer.price = price_nodes.first.text.to_s.squish
      currencies.each { |cur| offer.price.gsub!(cur, '') }

      if !offer.price.blank?
        price_text = offer.price.gsub(/[a-zA-Z]/, '').squish
        price_text.gsub!(' ', '')
        price_text.gsub!(',', '') if price_text['.'] and price_text[',']
        offer.numeric_price = BigDecimal.new(price_text, 2) rescue ''
      end
    end

      # byebug
    # }

    render json: offer.to_h.as_json
  end

  def agent
    @agent ||= Mechanize.new { |agent|
      agent.user_agent_alias = 'Mac Safari'
      agent.follow_meta_refresh = true
      # agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    }
  end

  def use_strategy1

  end

  def use_strategy2
    
  end

  def currencies
    ['EUR', 'eur', 'Eur', '€', '$', 'USD', 'usd', 'CHF', 'Fr.', 'Fr', '£', 'GBP', 'gbp']
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
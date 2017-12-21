class JsonModel::Offer < JsonModel::Base
  attr_accessor :agent_id
  attr_accessor :agent_url
  attr_accessor :image_url
  attr_accessor :name
  attr_accessor :slug
  attr_accessor :tags

  attr_accessor :price
  attr_accessor :old_price
  attr_accessor :price_per_kilo
  attr_accessor :price_currency

  attr_accessor :thumb_url
  attr_accessor :image_url

  def initialize(params)
    params.keys.each { |opt| self.send("#{opt}=".to_sym, params[opt]) } if params
    self.price_currency ||= 'EUR'
  end

  def self.from_eci_json(params)

    product_node = params['product']

    offer = self.new({ name: product_node['name'][0], agent_id: product_node['id'][0],
                       thumb_url: product_node['media']['thumbnail_url'], image_url: product_node['media']['thumbnail_url'].gsub("40x40", "600x600") })

    # Price arrives in format of ['1', '99'] for 1.99
    offer.price = BigDecimal.new(product_node['price']['price'][0] + "." + product_node['price']['price'][1])

    if product_node['price']['original_price']
      offer.old_price = BigDecimal.new(product_node['price']['original_price'][0] + "." + product_node['price']['original_price'][1])
    end

    offer.agent_url = "https://beta.elcorteingles.es" + product_node['pdp_url']
    offer.price_per_kilo = product_node['price']['pum_price'].to_s.gsub('&euro;', '€')
    offer.price_per_kilo << '€ / Kg' if offer.price_per_kilo.downcase[/kg|kilo|litr/].nil?

    offer
  end

  def self.from_crf_html_node(node)
    name = node.css('.name-marca a').map(&:text).first
    thumb_url = image_url = node.css('.image img').first.try(:attribute, 'src').try(:value)
    price = node.css('.content-price .price')[0].text.split("\n").last.split(" ")[0].gsub(',', '.').to_f
    price_per_kilo = node.css('.desc-product').try(:[], 0).try(:text).to_s.split("\n").last.split(" ").last.gsub(',', '.') + " / Kg o litr."
    agent_url = "https://www.carrefour.es" + node.css('.image a').try(:[], 0).try(:attribute, 'href').try(:value)
    agent_id = node.css('h2.name-product')[0].attribute('id').value.split('-').last

    offer = self.new({ name: name,
                       thumb_url: thumb_url, image_url: image_url, price: price, price_per_kilo: price_per_kilo,
                       agent_url: agent_url,
                       agent_id: agent_id })

    offer
  end

  def self.from_amz_html_node(node)
    name = node.css('h2').map(&:text).first
    thumb_url = image_url = node.css('.a-col-left img').first.try(:attribute, 'src').try(:value)

    price_node = node.css('.s-price').any? ? node.css('.s-price')[0] : node.css('.a-color-price')[0]

    if price_node
      price = price_node.text.squish.gsub(',', '.').gsub('EUR', '').squish.to_f
    else
      price = 0
    end

    price_per_kilo = nil

    if node.css('a.a-link-normal').any?
      agent_url = node.css('a.a-link-normal')[0].attribute('href').value
      agent_id = agent_url.gsub('https://www.amazon.es/', '')
    else
      agent_url = ''
      agent_id = (rand * 10000000).to_s
    end

    offer = self.new({ name: name,
                       thumb_url: thumb_url, image_url: image_url, price: price, price_per_kilo: price_per_kilo,
                       agent_url: agent_url,
                       agent_id: agent_id })

    offer
  end

  def as_json(param)
    super(param)
  end
end

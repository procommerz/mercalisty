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

  def as_json(param)
    super(param)
  end
end

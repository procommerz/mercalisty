class OffersService
  def self.instance
    @@instance ||= OffersService.new
  end

  def self.query(keywords)
    instance.query(keywords)
  end

  def query(keywords)

  end

  def going_stale_time
    24.hours
  end
end
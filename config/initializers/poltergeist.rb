require 'capybara/poltergeist'

options = {js_errors: false,
           phantomjs_logger: "#{Rails.root}/log/phantomjs.log",
           :phantomjs_options => ['--ignore-ssl-errors=yes', '--ssl-protocol=TLSv1.2']}

Capybara::Poltergeist::Client::PHANTOMJS_SCRIPT = "#{Rails.root}/lib/capybara/poltergeist/client/compiled/main.js"

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app, options)
end


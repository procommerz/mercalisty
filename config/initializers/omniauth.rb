# Rails.application.config.middleware.use OmniAuth::Builder do
#   provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET']
# end

OmniAuth.config.full_host = Rails.env.production? ? 'https://mercalisty.com' : 'http://localhost:3000'
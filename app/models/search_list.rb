require 'securerandom'

class SearchList < ActiveRecord::Base
  TOKEN_LENGTH = 8

  before_save :generate_token

  def generate_token
    if self.token.blank?
      attempts = 0

      token = SecureRandom.hex(4)
      attempts += 1

      while(SearchList.where(token: token).any? and attempts < 10)
        token = SecureRandom.hex(4)
      end

      self.token = token
    end
  end
end
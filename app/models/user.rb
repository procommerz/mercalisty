class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable,
         jwt_revocation_strategy: JwtBlacklist, omniauth_providers: [:google_oauth2]

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.where(email: data['email']).first

    # We want users to be created if they don't exist
    if !user
      tmp_psw = Devise.friendly_token[0, 20]

      user = User.create!(
          first_name: data['name'] || data['first_name'],
          last_name: data['last_name'],
          image_url: data['image'],
          profile_url: data['urls'].try(:first).try(:[], 1),
          email: data['email'],
          password: tmp_psw,
          password_confirmation: tmp_psw
      )
    end

    user
  end
end

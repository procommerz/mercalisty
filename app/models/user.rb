class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable,
         :recoverable, :rememberable, :trackable, :validatable,
         jwt_revocation_strategy: JwtBlacklist
end

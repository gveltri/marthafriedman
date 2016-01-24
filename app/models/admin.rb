class Admin < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  attr_accessor :admin_code
  
  validates_each :admin_code, :on => :create do |record, attr, value|
    record.errors.add attr, "Please enter correct invite code" unless
      value && value == "12345"
  end
  
end

class Product < ActiveRecord::Base
  
  def self.find_products_for_sale
    find(:all, :order=>"title")
  end

  validates_presence_of :title, :description, :image_url
  validates_numericality_of :price
  validate :price_must_be_at_least_a_cent
  validates_uniqueness_of :title
  validates_length_of :title, :maximum=>10
  validates_format_of :image_url,
                      :with => %r{\.(gif|png|jpg|jpeg)$}i,
                      :message => "must be a url for GIF, PNG, or JPG/JPEG image";
  protected
  def price_must_be_at_least_a_cent
    errors.add(:price, 'should be at least 0.01') if price.nil? || price<0.01
  end
end
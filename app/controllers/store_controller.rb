class StoreController < ApplicationController
  def index
    @products = Product.find_products_for_sale
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @products }
    end
  end
end

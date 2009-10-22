class StoreController < ApplicationController
  def index
    @products = Product.find_products_for_sale
    @count = increment_count
    @cart=find_cart

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @products }
    end
  end
    
  def add_to_cart
    product = Product.find(params[:id])
    @cart=find_cart
    @cart.add_product(product)
    session[:counter] ||=0
    session[:counter]=0
    redirect_to_index
  rescue ActiveRecord::RecordNotFound
    logger.error("Attempt to access invalid product #{params[:id]}")
    flash[:notice]="Invalid Product"
    redirect_to :action => 'index'
  end

  def redirect_to_index(msg=nil)
    
  end

  def empty_cart
    session[:cart] = nil
    flash[:notice] = "Your cart is currently empty"
    redirect_to :action => 'index'
  end

  def increment_count
    if session[:counter].nil?
      session[:counter]=0
    else
      session[:counter]+=1
    end
  end

  private
  def find_cart
    session[:cart] ||=Cart.new
  end
end

class AddTestData < ActiveRecord::Migration
  def self.up
    Product.delete_all
    Product.create(:title => 'Dollar',
                    :description => 
                    '<p>President Barack Obama has completely destroyed the dollar, thanks to Ben Bernanke and Federal Reserve. The death of dollar as world\'s leading reserve currency is imminent.</p>',
                    :image_url =>'/img/dollar.jpg',
                    :price => 0.01)
    Product.create(:title => 'Euro',
                    :description => 
                    '<p>Euro is even a bigger sucker than dollar, soon it will follow Dollar\'s footstep and then world will be forced to use gold as their reserve money.</p>',
                    :image_url =>'/img/euro.jpg',
                    :price => 1.34)
    Product.create(:title => 'Gold',
                    :description => 
                    '<p>Gold is awesome!</p>',
                    :image_url =>'/img/gold.jpg',
                    :price => 1034.0)
                    # . . .
  end

  def self.down
    Product.delete_all
  end
end

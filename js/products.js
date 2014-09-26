(function($, undefined){
	'use strict';
	
	// Product class which renders all the product details
	function Products(){
		this.render = function (productDetailCollection){
			if(productDetailCollection){
				var products = productDetailCollection.productDetails,
				frag = document.createDocumentFragment(),
				link = $('<div/>').html($('<a>/').attr('href',productDetailCollection.url)
													 .text('Crawled Link'))
									  .append($('<span/>').html(" : "+productDetailCollection.url))
									  .addClass('col-md-12 theme-link-heading');
				
				$('.js-product-details').append(link);
				
				for(var key in products){
					if(products.hasOwnProperty(key)){
						var currentProduct = products[key],
						productLinkContainer = $('<a/>').attr('href', currentProduct.link).html($('<img/>').attr('src', currentProduct.imagePath)),
						productPriceContainer = $('<div/>').html($('<span/>').text("Price : " + currentProduct.price)),
						productNameContainer = $('<div/>').html($('<span/>').text(currentProduct.name)),
						productContainer = $('<div/>').addClass('col-md-4 col-sm-6 col-xs-12 theme-product-container')
													  .append(productLinkContainer)
													  .append(productNameContainer)
													  .append(productPriceContainer);
						
						frag.appendChild(productContainer[0]);
					}
				}
				$('.js-product-details').append(frag);
			}
		}
	}

	function getProductInstance(){
		return new Products();
	}
	
	window.getProductInstance = getProductInstance;
	
})(jQuery);
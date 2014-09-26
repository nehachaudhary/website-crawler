(function($, undefined){
	'use strict';
	
	// Product class which renders all the product details
	function Products(){
		this.render = function (productDetailCollection){
			if(productDetailCollection){
				var frag = document.createDocumentFragment();

				for(var key in productDetailCollection){
					if(productDetailCollection.hasOwnProperty(key)){
						var currentProduct = productDetailCollection[key],
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
				$('.theme-product-details').show();
			}
		}
	}

	function getProductInstance(){
		return new Products();
	}
	
	window.getProductInstance = getProductInstance;
	
})(jQuery);
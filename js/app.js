(function($, undefined){
	'use strict';
	
	var baseURL = 'http://newsmartwave.net/html/venedor/',
	crawler = getCrawlerInstance();
	
	
	// Collects the link from the response after crawling the starting link
	crawler.downloadContent({
		link : baseURL + 'green/index.html',
		xPathCondition : 'AND xpath=\"//a[contains(@href,\'%2Ehtml\')]\"',
		successCallback : collectLinks,
		afterSuccessCallback : [renderCrawledLinks, crawlProduct]
	});

	
	var visitedLinkCollection = [];
	
	function collectLinks(data) {
	    var results = data.query.results,
		allLinks,
		href, index, j;
		if(results){
			allLinks = results.a;
			for(index = 0; index < allLinks.length; index++){
		    	href = allLinks[index].href.replace(/\.\./g,'').replace('/','');
		    	if ($.inArray(href, visitedLinkCollection) === -1) {
		    		crawler.downloadContent({
						link : baseURL + href,
						xPathCondition : ' AND xpath=\"//ul[@class=\'menu clearfix\']/li[1]/ul/li/a[contains(@href,\'%2Ehtml\')]\"',
						successCallback : collectLinks
		    		});
		    		visitedLinkCollection.push(href);
		    	}
		    }
			visitedLinkCollection.length;
		}
	}
	
	// Crawls all the link in the collection to download the product details
	function crawlProduct(){
		  function crawlPage(link){
			var link = baseURL + link;
			crawler.downloadContent({
						link : link,
						xPathCondition : ' AND (xpath=\"//div[@class=\'item\']\" OR xpath=\"//div[@class=\'item item-hover\']\")',
						successCallback : function(data) {
							showProducts(link, data)
						}
					});
		  }
		  
		  for(var i = 0; i < visitedLinkCollection.length; i++){
			  crawlPage(visitedLinkCollection[i]);
		  }
	}
	
	// Renders the crawled link and the product details 
	function showProducts(url, data){
		getProductInstance().render(formatProductData(url, data));
	}
	
	// strategy which formats product details as required by the product class to render the products.
	function formatProductData(homePageURL, data) {
		if(data.query.results){
			var productDetailCollection = {},
				baseURL = homePageURL.substr(0,homePageURL.lastIndexOf('index.html')),
				productContainers = data.query.results.div,
				productDetails = {},
				currentDiv,
				priceContainer,
				product, name, price;
			
			for (var i = 0; i < productContainers.length; i++) {
				currentDiv = productContainers[i];
				if(currentDiv.div[0].div){
					priceContainer = $.isArray(currentDiv.div[0].div.span) ? currentDiv.div[0].div.span[1] : currentDiv.div[0].div.span;
				}else{
					priceContainer = $.isArray(currentDiv.div[1].div[0].div.span) ? currentDiv.div[1].div[0].div.span[1] : currentDiv.div[1].div[0].div.span;
				}
	
				name = currentDiv.div[1].h3.a.content;
				price = priceContainer.content.trim() + (priceContainer.span ? priceContainer.span.content : "");
				product = {
						name : name,
						imagePath : baseURL + currentDiv.div[0].a.img[0].src,
						price : price,
						link : baseURL + currentDiv.div[0].a.href
				};
				productDetails[name+price] = product;
			}
			
			productDetailCollection.url = homePageURL;
			productDetailCollection.productDetails = productDetails;
			return productDetailCollection;
		}
	};
	
	function renderCrawledLinks(){
		var frag = document.createDocumentFragment(), url;
		for(var index = 0; index < visitedLinkCollection.length; index++){
			url = baseURL + visitedLinkCollection[index];
			var link = $('<div/>').html($('<a/>').attr('href',url).text(url));
			frag.appendChild(link[0]);
		}
		$('.js-crawled-links').append(frag);
	}
	
})(jQuery);
(function($, undefined){
	"use strict";

/*
 * robot.txt file cant be read from the following site because of CORS 
 * http://newsmartwave.net/robot.txt",
 * */

	var linkCollection = [],
		visitedLinkCollection = [],
		productDetailCollection = [],
		baseURL = 'http://newsmartwave.net/html/venedor/green/',
		yqlURL = 'https://query.yahooapis.com/v1/public/yql?q=',
		executeOnce = true;
							  

		function getQueryString(url){
			return 'SELECT * FROM html WHERE url=\"'
					  + url + 
					  '\" AND xpath=\"//a[contains(@href,\'%2Ehtml\')]\"&format=json';
		}
		
		function downloadContent(url, callback, linkCollection){
			$.getJSON(url, callback).then(function(){
			// this will be done only on visitedLinkCollection
				crawlDeep(linkCollection);
				if(executeOnce){
					renderLinks(linkCollection);
					displayProductDetails(linkCollection);
				}
				executeOnce = false;
			});
		}

		function crawlDeep(linkCollection){
			for(var j = 0; j < linkCollection.length; j++){
				var url = getQueryString(baseURL + linkCollection[j]);
		    	if ($.inArray(linkCollection[j], visitedLinkCollection) === -1) {
		    		visitedLinkCollection.push(linkCollection[j]);
		    		downloadContent(yqlURL + url, yqlCallback, visitedLinkCollection);
		    	}
			}
		}
		
		function renderLinks(linkCollection){
			for(var index = 0; index < linkCollection.length; index++){
				var link = $('<div/>').html(baseURL + linkCollection[index]);
				$('.js-link-list').append(link);
			}
		}
		
		function displayProductDetails(linkCollection){
			var productLinks = $.grep(linkCollection, function(item, index){
				return item.indexOf("index.html") > -1;
			});
			
		}
		
		function yqlCallback(data) {
		    var results = data.query.results;
		    if(results !== null){
			    var allLinks = results.a;
			    for(var index = 0; index < allLinks.length; index++){
			    	var href = allLinks[index].href.replace(/\.\./g,'').replace('/','');
			    	if ($.inArray(href, linkCollection) === -1) {
			    		linkCollection.push(href);
			    	}
			    }
		    }
		}

		// home page content
		downloadContent(yqlURL + getQueryString(baseURL + "index.html"), yqlCallback, linkCollection);
		
})(jQuery);
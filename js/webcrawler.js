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
		yqlURL = 'https://query.yahooapis.com/v1/public/yql?q=';
							  

		function getQueryString(url){
			return 'SELECT * FROM html WHERE url=\"'
					  + url + 
					  '\" AND xpath=\"//a[contains(@href,\'%2Ehtml\')]\"&format=json';
		}
		
		function downloadContent(url, callback){
			$.getJSON(url, callback).then(function(){
			// this will be done only on visitedLinkCollection
				for(var index = 0; index < linkCollection.length; index++){
					var url = getQueryString(baseURL + linkCollection[index]);
					if ($.inArray(linkCollection[index], visitedLinkCollection) === -1) {
						visitedLinkCollection.push(linkCollection[index]);
						linkCollection.splice(index,1);
						var link = $('<div/>').html(baseURL + linkCollection[index]);
						$('.js-link-list').append(link);
						downloadContent(yqlURL + url, yqlCallback);
					}
				}
			});
		}

		function yqlCallback(data) {
		    var results = data.query.results;
		    if(results !== null){
			    var allLinks = results.a;
			    for(var index = 0; index < allLinks.length; index++){
			    	if ($.inArray(allLinks[index].href, linkCollection) === -1) {
			    		linkCollection.push(allLinks[index].href);
			    	}
			    }
		    }
		}

		downloadContent(yqlURL + getQueryString(baseURL + "index.html"), yqlCallback);
		
})(jQuery);
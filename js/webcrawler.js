(function($, undefined){
	"use strict";
	
	var linkCollection = [],
		visitedLinkCollection = [],
		baseURL = 'http://newsmartwave.net/html/venedor/green/',
		yqlURL = 'https://query.yahooapis.com/v1/public/yql?q=',
		queryString = 'SELECT * FROM html WHERE url="' + baseURL + 'index.html" AND xpath="//a[contains(@href,".html")]"&format=json';

		function yqlCallback(data) {
		    var results = data.query.results;
		    console.log(results);
		}
	
		$.getJSON(yqlURL + encodeURIComponent(queryString), yqlCallback);
		
})(jQuery);
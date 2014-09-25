(function($, window, undefined){
	'use strict';
	
	// yqlURL is the URL of YQL api which helps in downloading the HTML
	var yqlURL = 'https://query.yahooapis.com/v1/public/yql?q=',
	// formURL forms the URL which will be requested to YQL API to crawl the HTML.
	formURL = function(url, xPathCondition){
		return yqlURL + 'SELECT * FROM html WHERE url=\"' + url +'"'+ xPathCondition + '&format=json';
	},
	crawler;
	
	var Crawler = function (){
		// downloads the content from the specified URL
		this.downloadContent = function(options){
			$.getJSON(formURL(options.link, options.xPathCondition), options.successCallback);
		};
	};
	
	crawler = new Crawler();
	function getCrawlerInstance(){
		return crawler;
	}
	window.getCrawlerInstance = getCrawlerInstance;
	
})(jQuery, window);
var wittl = angular.module('wittl', [
	'ngCookies',
	'ngDropdowns',
	
	/* Lists
	 * ------------------- */
	'listsService',
	'listsController',
	'listsFilter',

	/* List Items
	 * ------------------- */
	'listItemService',
	'listItemController',

	/* Wittls
	 * ------------------- */
	'wittlsService',
	'wittlsController',
	'wittlsDirective'
]);

wittl.config(function ($httpProvider, $interpolateProvider, $resourceProvider) {

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $resourceProvider.defaults.stripTrailingSlashes = false;

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});
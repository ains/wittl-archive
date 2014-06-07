var wittl = angular.module('wittl', [
	'ngCookies',

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
	'wittlsController'
]);

wittl.config(function ($httpProvider, $interpolateProvider, $resourceProvider) {

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $resourceProvider.defaults.stripTrailingSlashes = false;

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});

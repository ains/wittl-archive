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
	'wittlsController',
	'wittlsDirective',

	/* Favourites
	 * ------------------- */
	'favouritesController',

	 /* Vendor
	 * ------------------- */
	 'ui.sortable'
]);

wittl.config(function ($httpProvider, $interpolateProvider, $resourceProvider) {

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $resourceProvider.defaults.stripTrailingSlashes = false;

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
}).filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});

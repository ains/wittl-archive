var wittl = angular.module('wittl', [
<<<<<<< HEAD
	'ngCookies',

	/* Lists
	 * ------------------- */
	'listsService',
	'listsController',
	'listsFilter',

	/* List Items
	 * ------------------- */
	'listItemsService',

	/* Wittls
	 * ------------------- */
	'wittlsService',
	'wittlsController'
]);

wittl.config(function($httpProvider, $interpolateProvider, $resourceProvider) {
=======
    'ngCookies',
    'listsService',
    'listItemService',
    'listsController',
    'listsFilter'
]);

>>>>>>> c42d21084cf4a149cb60e7065141440114e9ca5c

wittl.controller('ListItemsCtrl', ['$scope', 'ListItem', function ($scope, ListItem) {
    $scope.items = ListItem.query({listID: 1});
}]);

<<<<<<< HEAD
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $resourceProvider.defaults.stripTrailingSlashes = false;
=======
wittl.config(function ($httpProvider, $interpolateProvider) {
>>>>>>> c42d21084cf4a149cb60e7065141440114e9ca5c

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});

var wittl = angular.module('wittl', [
	'ngCookies',
	
	'listsService',
	'listsController',
	'listsFilter'
]);

wittl.config(function($httpProvider, $interpolateProvider) {

        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

	})
    .run(function($http, $cookies) {
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    });
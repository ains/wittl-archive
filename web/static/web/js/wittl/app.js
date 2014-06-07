var wittl = angular.module('wittl', [
    'ngCookies',
    'listsService',
    'listItemService',
    'listsController',
    'listsFilter'
]);


wittl.controller('ListItemsCtrl', ['$scope', 'ListItem', function ($scope, ListItem) {
    $scope.items = ListItem.query({listID: 1});
}]);

wittl.config(function ($httpProvider, $interpolateProvider) {

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});
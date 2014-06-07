var wittl = angular.module('wittl', [
	'listsService',
	'listsController',
	'listsFilter'
]);

wittl.controller('ListItemsCtrl', ['$scope', 'Lists', function ($scope, Lists) {
    $scope.list = Lists.get({listID: 1});
}]);

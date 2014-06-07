var listsController = angular.module('listsController', []);

listsController.controller('ListsCtrl', ['$scope', 'Lists', 
	function($scope, Lists) {
		$scope.lists = Lists.query();
	}]);
var listsController = angular.module('listsController', []);

listsController.controller('ListsCtrl', ['$scope', 'Lists', 'Broadcast', 
	function($scope, Lists, Broadcast) {
		$scope.lists = Lists.query();

		$scope.selectList = function(id) {
			console.log(id);
			Broadcast.addData('selectedList', id);
		}

	}]);

listsController.controller('ListsQuickAddCtrl', ['$scope', 'Broadcast',
	function($scope, Broadcast) {
		
		$scope.addItemToList = function() {
			var data = Broadcast.getData();

			if(data.selectedList) {
				console.log('Adding item to list ' + data.selectedList);
			} else {
				console.log('error');
			}
		};

	}]);
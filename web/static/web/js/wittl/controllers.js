var listsController = angular.module('listsController', []);
var listItemController = angular.module('listItemController', []);
var wittlsController = angular.module('wittlsController', []);



listsController.controller('ListsCtrl', ['$scope', 'Lists', 'Broadcast', 
	function($scope, Lists, Broadcast) {
		$scope.lists = Lists.query();

		$scope.selectList = function(id) {
			console.log(id);
			Broadcast.addData('selectedList', id);
		}

	}]);

listsController.controller('ListsQuickAddCtrl', ['$scope', 'ListItem', 'Broadcast',
	function($scope, ListItem, Broadcast) {
		
		$scope.addItemToList = function() {
			var data = Broadcast.getData();

			if(data.selectedList) {
				var newItem = {
					url: $scope.item.url,
					list_id: data.selectedList
				};
				console.log('Adding item to list ' + data.selectedList);

				ListItems.save(newItem)
			} else {
				console.log('error');
			}
		};

	}]);


listItemController.controller('ListItemsCtrl', ['$scope', 'ListItem', 
	function ($scope, ListItem) {
    	$scope.items = ListItem.query({listID: 1});
	}]);


wittlsController.controller('WittlsCtrl', ['$scope', 'Wittls',
	function($scope, Wittls) {
		$scope.availableWittls = Wittls.all.query();
	}]);

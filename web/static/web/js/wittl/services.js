/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);
var listItemsService = angular.module('listItemsService', ['ngResource']);
var wittlsService = angular.module('wittlsService', ['ngResource']);


listsService.factory('Lists', ['$resource',
<<<<<<< HEAD
	function($resource) {
		return $resource(api + '/lists/:listID/');
	}]);

listsService.factory('Broadcast', 
	function() {
		var data = {};
		return {
			getData: function() {
				return data;
			},
			addData: function(k, v) {
				data[k] = v;
			}
		}
	});



listItemsService.factory('ListItems', ['$resource',
	function($resource) {
		return $resource(api + '/list-items/');
	}]);



wittlsService.factory('Wittls', ['$resource',
	function($resource) {
		return {
			all: $resource(api + '/comparators/', {}, {
				query: {
					isArray: false
				}
			})
		}
	}]);
=======
    function ($resource) {
        return $resource(api + '/lists/:listID', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }]);

listsService.factory('Broadcast',
    function () {
        var data = {};
        return {
            getData: function () {
                return data;
            },
            addData: function (k, v) {
                data[k] = v;
            }
        }
    });


var listItemService = angular.module('listItemService', ['ngResource']);

listItemService.factory('ListItem', ['$resource',
    function ($resource) {
        return $resource(api + '/lists/:listID/items/:listItemID',
            {listItemID: "@id"}, {}
        );
    }]);
>>>>>>> c42d21084cf4a149cb60e7065141440114e9ca5c

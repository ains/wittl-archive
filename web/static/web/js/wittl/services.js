/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);
var listItemsService = angular.module('listItemsService', ['ngResource']);
var wittlsService = angular.module('wittlsService', ['ngResource']);


listsService.factory('Lists', ['$resource',
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
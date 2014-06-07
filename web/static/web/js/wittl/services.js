/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);
var listItemService = angular.module('listItemService', ['ngResource']);
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




listItemService.factory('ListItem', ['$resource',
    function ($resource) {
        return $resource(api + '/lists/:listID/items/:listItemID',
            {listItemID: "@id"}, {}
        );
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
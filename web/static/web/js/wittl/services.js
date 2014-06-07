/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);

listsService.factory('Lists', ['$resource',
	function($resource) {
		return $resource(api + '/lists/:listID', {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}]);
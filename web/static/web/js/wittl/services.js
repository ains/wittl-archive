/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);

listsService.factory('Lists', ['$resource',
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

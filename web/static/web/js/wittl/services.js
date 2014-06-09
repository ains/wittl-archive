/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);
var listItemService = angular.module('listItemService', ['ngResource']);
var wittlsService = angular.module('wittlsService', ['ngResource']);


listsService.factory('Lists', ['$resource',
    function ($resource) {
        return $resource(api + '/lists/:listID/');
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


listItemService.factory('ListItem', ['$resource',
    function ($resource) {
        return $resource(api + '/lists/:listID/items/:listItemID',
            {listItemID: "@id"}, {}
        );
    }]);


listItemService.service('Sorting', ['$rootScope', '$http', function ($rootScope, $http) {
    var service = {
        updateScores: function (listID, callback) {
            $rootScope.startNanobar();
            $http.get(api + '/lists/' + listID + '/score_data/').
                success(function (data) {
                    service.scoringData = data;
                    $rootScope.$broadcast('sorting.update');
                    $rootScope.finishNanobar();
                    callback(data);
                }).
                error(function (data) {
                });
        },
        getScoreByID: function (cardID) {
            var wittlOrder = [1];
            return _.reduce(wittlOrder, function (acc, wittl, index) {
                var totalScore = _.reduce(service.scoringData, function (acc, cardData, index) {
                    return acc + cardData[wittl]["score"];
                }, 0);

                var cardData = service.scoringData[cardID];
                var score = (wittl in cardData) ? cardData[wittl].score : 0;
                var normalisedScore = score / totalScore;
                return acc + (normalisedScore * (1 / Math.pow(8, index)));
            }, 0) * 100;
        }
    };

    return service;
}]);


wittlsService.factory('Wittls', ['$resource',
	function($resource) {
		return {
			all: $resource(api + '/wittls/', {}, {
				query: {
					isArray: true
				}
			})
		}
	}]);

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
        updateScores: function () {
            $http.get(api + '/lists/1/score_data').
                success(function (data) {
                    service.scoringData = data;
                    console.log(service.scoringData);
                    $rootScope.$broadcast('sorting.update');
                }).
                error(function (data) {
                });
        },
        getScoreByID: function (cardID) {
            var wittlOrder = $('.wittl').map(function (i, e) {
                return $(e).data('wittl-id');
            });

            return _.reduce(wittlOrder, function (acc, wittl, index) {
                var totalScore = _.reduce(scoringData, function (acc, cardData, index) {
                    return acc + cardData[wittl]["score"];
                }, 0);
                var score = (wittl in scoringData[cardID]) ? scoringData[cardID][wittl]["score"] : 0;
                var normalisedScore = score / totalScore;
                return acc + (normalisedScore * (1 / Math.pow(8, index)));
            }, 0) * 100;
        }
    };

    service.updateScores();

    return service;
}]);


wittlsService.factory('Wittls', ['$resource',
    function ($resource) {
        return {
            all: $resource(api + '/comparators/', {}, {
                query: {
                    isArray: true
                }
            })
        }
    }]);
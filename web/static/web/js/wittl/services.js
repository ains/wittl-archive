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


listItemService.service('Sorting', ['$rootScope', 'Wittl', '$http',
    function ($rootScope, Wittl, $http) {
        var service = {
            scoringData: {},
            updateScores: function (listID, callback) {
                $rootScope.startNanobar();
                $http.get(api + '/lists/' + listID + '/score_data/').
                    success(function (data) {
                        service.scoringData = data;
                        $rootScope.$broadcast('sorting.update');
                        $rootScope.finishNanobar();

                        if (!angular.isUndefined(callback)) {
                            callback(data);
                        }
                    }).
                    error(function (data) {
                    });
            },
            getSummariesById: function (cardID, n) {
                var wittlOrder = _.take(Wittl.getOrder(), n);
                return _.map(wittlOrder, function (wittlID) {
                    return service.scoringData[cardID][wittlID]["summary"]
                });
            },
            getScoreByID: function (cardID) {
                var wittlOrder = Wittl.getOrder();
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


wittlsService.factory('Wittl', ['$http', '$resource',
    function ($http, $resource) {
        var service = {
            wittls: [
                {
                    text: 'any wittl',
                    model: {},
                    fields: {}
                }
            ],
            getOrder: function () {
                var hasID = function (object) {
                    return _.has(object, "id");
                };

                return _.map(_.filter(service.wittls, hasID), function (x) {
                    return x.id
                });
            },
            getConfiguration: function () {
                return $http.get(api + '/wittls/', {})
            },
            list: $resource(api + '/lists/:listID/wittls/:wittlID/', {wittlID: "@id", listID: "@list"}, {
                'update': {method: 'PUT'}
            })
        };

        return service;
    }]);
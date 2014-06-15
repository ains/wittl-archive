/* Refactor into settings? */
var api = '/api/v1';


var listsService = angular.module('listsService', ['ngResource']);
var listItemService = angular.module('listItemService', ['ngResource']);
var wittlsService = angular.module('wittlsService', ['ngResource']);
var userService = angular.module('userService', []);


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
        return {
            items: null,
            resource: $resource(api + '/lists/:listID/items/:listItemID',
                {listItemID: "@id", listID: "@list"}, {}
            )
        };
    }]);


listItemService.service('Sorting', ['$rootScope', 'Wittl', 'ListItem', '$http',
    function ($rootScope, Wittl, ListItem, $http) {
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
            getSummariesById: function (itemID, n) {
                var wittlOrder = _.take(Wittl.getOrder(), n);
                return _.map(wittlOrder, service.getSummary(itemID));
            },
            getSummary: function (itemID) {
                return function (wittl) {
                    var comparatorName = wittl.comparator_name;
                    var wittlID = wittl.id;
                    if (comparatorName.indexOf("attr:") === 0) {
                        var attributeName = comparatorName.replace("attr:", "");
                        var item = _.findWhere(ListItem.items, {id: itemID});
                        return item.attributes.sortable_attrs[attributeName] + " " + attributeName;
                    } else {
                        return service.scoringData[itemID][wittlID]["summary"];
                    }
                }
            },
            getScoreByID: function (itemID) {
                var wittlOrder = Wittl.getOrder();
                return _.reduce(wittlOrder, function (acc, wittl, index) {
                    var comparatorName = wittl.comparator_name;
                    var wittlID = wittl.id;

                    var totalScore;
                    var score;
                    if (comparatorName.indexOf("attr:") === 0) {
                        var attributeName = comparatorName.replace("attr:", "");
                        totalScore = _.reduce(ListItem.items, function (acc, item, index) {
                            return acc + (1 / item.attributes.sortable_attrs[attributeName]);
                        }, 0);

                        var item = _.findWhere(ListItem.items, {id: itemID});

                        //Temporary hack - assumption is higher is better here, TODO: specify in models
                        score = 1 / item.attributes.sortable_attrs[attributeName];
                    } else {
                        totalScore = _.reduce(service.scoringData, function (acc, cardData, index) {
                            return acc + cardData[wittlID]["score"];
                        }, 0);

                        var cardData = service.scoringData[itemID];
                        score = (wittlID in cardData) ? cardData[wittlID].score : 0;
                    }

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
                var isActive = function (object) {
                    var isAttrWittl = _.has(object, "comparator_name") &&
                        object.comparator_name.indexOf("attr") === 0;
                    return _.has(object, "id") || isAttrWittl;
                };

                return _.map(_.filter(service.wittls, isActive), function (x) {
                    return {
                        'id': x.id,
                        'comparator_name': x.comparator_name
                    }
                });
            },
            getConfiguration: function () {
                return $http.get(api + '/wittls/', {})
            },
            list: $resource(api + '/lists/:listID/wittls/:wittlID/', {wittlID: "@id", listID: "@list"}, {
                'update': {method: 'PUT'}
            }),
            favourites: $resource(api + '/favourites/'),
            options: {},
            attributeOptions: {}
        };

        return service;
    }]);

userService.factory('User', ['$http', '$resource',
    function ($http, $resource) {
        return {
            search: function (query) {
                return $http.get(api + "/user-search/", {params: {query: query}});
            },
            resource: function (listID) {
                return $resource(api + '/lists/:listID/users/', {listID: listID});
            }
        };
    }]);
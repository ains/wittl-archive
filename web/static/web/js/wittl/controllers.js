var listsController = angular.module('listsController', []);
var listItemController = angular.module('listItemController', ['iso', 'nanobar']);
var wittlsController = angular.module('wittlsController', []);
var favouritesController = angular.module('favouritesController', []);


listsController.controller('ListsCtrl', ['$scope', 'Lists', 'Broadcast',
    function ($scope, Lists, Broadcast) {
        $scope.lists = Lists.query();

        $scope.selectList = function (id) {
            Broadcast.addData('selectedList', id);
        }

    }]);

listsController.controller('ListsQuickAddCtrl', ['$scope', 'ListItem', 'Broadcast',
    function ($scope, ListItem, Broadcast) {

        $scope.addItemToList = function () {
            var data = Broadcast.getData();

            if (data.selectedList) {
                var newItem = {
                    url: $scope.item.url,
                    list_id: data.selectedList
                };

                ListItems.save(newItem)
            }
        };

    }]);


listItemController.controller('ListItemsCtrl', ['$scope', '$http', 'ListItem', 'Wittl', 'Sorting',
    function ($scope, $http, ListItem, Wittl, Sorting) {
        $scope.$watch("listID", function () {
            var listID = $scope.listID;
            $scope.items = [];
            $scope.wittlOrder = Wittl;

            var resort = function () {
                $scope.$emit('iso-option', {
                    getSortData: {
                        wittlWeight: function (elem) {
                            var itemID = $(elem).children('.card').data('id');
                            return Sorting.getScoreByID(itemID);
                        }
                    }
                });

                $scope.$emit('iso-method', {name: 'updateSortData', params: null});
                $scope.$emit('iso-option', {sortBy: 'wittlWeight'});

                //Update summaries
                angular.forEach($scope.items, function (item) {
                    item.summary = Sorting.getSummariesById(item.id, 3);
                });
            };
            $scope.$on('sorting.update', resort);
            $scope.$watch('wittlOrder.wittls', resort, true);


            Sorting.updateScores(listID, function () {
                $scope.items = ListItem.query({listID: 1}, function () {
                    resort();
                });
            });

            $scope.createListItem = function (e) {
                e.preventDefault();

                var l = $('#new-list-item-submit').ladda();
                l.ladda('start');

                var url = this.newItemURL;
                this.newItemURL = '';

                var onSuccess = function (data) {
                    Sorting.updateScores(listID, function () {
                        $scope.items.push(data);
                        l.ladda('stop');
                    });
                };

                var onEror = function () {
                    l.ladda('stop');
                };
                $http.post(api + '/lists/' + listID + '/items/', {url: url, list_id: listID})
                    .success(onSuccess).error(onEror);
            };


            $scope.toggleFavourite = function (e, item) {
                e.stopPropagation();
                $http.post(api + '/lists/' + listID + '/items/' + item.id + "/toggle_favourite/", {})
                    .success(function () {
                        item.favourited = !item.favourited;
                    });
            };

            $scope.showModal = function (item) {
                var data = item.attributes;
                var renderMap = function (lat, long) {
                    var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
                    var mapOptions = {
                        center: latLng,
                        zoom: 8,
                        disableDefaultUI: true
                    };

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                };

                var template = Handlebars.Templates['modal_template'];


                var $modal = $('#card-detail');
                $modal.find('.modal-content')
                    .empty()
                    .append(template(data));

                $modal.on('shown.bs.modal', function (e) {
                    renderMap(data.latitude, data.longitude);

                }).modal('show');
            }
        });
    }]);


wittlsController.controller('WittlsCtrl', ['$scope', 'Wittl', 'Sorting',
    function ($scope, Wittl, Sorting) {
        $scope.wittlOptions = {};
        $scope.clauses = Wittl.wittls;

        Wittl.getConfiguration().then(function (response) {
            angular.forEach(response.data, function (wittl, key) {
                var fields = {};
                for (var i = 0; i < wittl.fields.length; i++) {
                    fields[wittl.fields[i].name] = '';
                }
                $scope.wittlOptions[key] = {
                    text: wittl.display_name,
                    model: wittl,
                    fields: fields
                };
            });
        });

        $scope.$watch('listID', function (newId) {
            if (newId) {
                Wittl.list.listID = newId;
                Wittl.list.query({listID: newId}, function (response) {
                    //Insert in reverse order as we're unshifting
                    for (var i = response.length - 1; i >= 0; i--) {
                        var activeWittl = response[i];
                        var wittl = $scope.wittlOptions[activeWittl.comparator_name];
                        if (wittl) {
                            var newWittl = angular.copy(activeWittl);
                            newWittl.text = wittl.text;
                            newWittl.model = wittl.model;
                            newWittl.canSave = true;
                            $scope.clauses.unshift(newWittl);
                        }
                    }

                });
            }
        });

        $scope.sortableWittlsOptions = {
            stop: function (e, ui) {
                angular.forEach($scope.clauses, function (wittl, i) {
                    wittl.order = i;
                    if (!angular.isUndefined(wittl.$update)) {
                        wittl.$update();
                    }
                });
            }
        };

        $scope.save = function (updatedWittl) {
            if (updatedWittl.canSave) {
                var listID = Wittl.list.listID;
                var request;
                if (angular.isUndefined(updatedWittl.$save)) {
                    var persistedWittl = new Wittl.list(updatedWittl);
                    persistedWittl.list = listID;

                    request = persistedWittl.$save(function (savedWittl) {
                        angular.extend(persistedWittl, savedWittl);
                        angular.extend(persistedWittl, updatedWittl);
                        angular.copy(persistedWittl, updatedWittl);
                    });
                } else {
                    request = updatedWittl.$update();
                }

                request.then(function () {
                    Sorting.updateScores(listID);
                });
            }
        };

    }]);

favouritesController.controller('FavouritesCtrl', ['$scope', 'Wittl',
    function ($scope, Wittl) {
        $scope.items = Wittl.favourites.query();
    }]);
var listsController = angular.module('listsController', []);
var listItemController = angular.module('listItemController', ['iso', 'nanobar']);
var wittlsController = angular.module('wittlsController', []);


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
                console.log('Adding item to list ' + data.selectedList);

                ListItems.save(newItem)
            } else {
                console.log('error');
            }
        };

    }]);


listItemController.controller('ListItemsCtrl', ['$scope', '$http', 'ListItem', 'WittlOrder', 'Sorting',
    function ($scope, $http, ListItem, WittlOrder, Sorting) {
        $scope.$watch("listID", function () {
            var listID = $scope.listID;
            $scope.items = [];
            $scope.wittlOrder = WittlOrder;

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


wittlsController.controller('WittlsCtrl', ['$scope', 'Wittls', 'WittlOrder',
    function ($scope, Wittls, WittlOrder) {
        $scope.wittlOptions = {};
        $scope.clauses = [];

        Wittls.getConfiguration().then(function (response) {
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
                Wittls.list.query({listID: newId}, function (response) {
                    var activeWittls = response;

                    //Insert in reverse order as we're unshifting
                    for (var i = activeWittls.length - 1; i >= 0; i--) {
                        var wittl = $scope.wittlOptions[activeWittls[i].comparator_name];
                        if (wittl) {
                            $scope.clauses.unshift({
                                text: wittl.text,
                                model: wittl.model,
                                id: activeWittls[i].id,
                                fields: activeWittls[i].configuration
                            });
                        }
                    }

                    WittlOrder.update($scope.clauses);
                });
            }
        });

        $scope.clauses = [
            {
                text: 'any wittl',
                model: {},
                fields: {}
            }
        ];

        $scope.sortableWittlsOptions = {
            update: function (e, ui) {
                WittlOrder.update($scope.clauses);
            }
        };

        $scope.save = function () {
            console.log('bluur');
        };

    }]);
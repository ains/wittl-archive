var listItemController = angular.module('listItemController', ['iso', 'nanobar']);

listItemController.controller('ListItemsCtrl', ['$scope', '$timeout', '$http', 'ListItem', 'Wittl', 'Sorting',
    function ($scope, $timeout, $http, ListItem, Wittl, Sorting) {
        $scope.$watch("listID", function () {
            var listID = $scope.listID;
            $scope.items = null;
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

                var sortableAttrs = _.intersection.apply(this, _.map($scope.items, function (item) {
                    return _.keys(item.attributes.sortable_attrs);
                }));

                angular.forEach(sortableAttrs, function (attr) {
                    Wittl.attributeOptions[attr] = {
                        text: attr,
                        model: {
                            'type': 'attr',
                            'preposition': ''
                        },
                        fields: {}
                    };
                });
            };
            $scope.$on('sorting.update', resort);
            $scope.$watch('wittlOrder.wittls', resort, true);


            Sorting.updateScores(listID, function () {
                ListItem.items = ListItem.resource.query({listID: listID}, function () {
                    resort();
                });
                $scope.items = ListItem.items;
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
                        resort();
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
                e.preventDefault();
                
                $http.post(api + '/lists/' + listID + '/items/' + item.id + "/toggle_favourite/", {})
                    .success(function () {
                        item.favourited = !item.favourited;
                    });
            };

            $scope.deleteItem = function (e, index, item) {
                e.stopPropagation();
                e.preventDefault();

                if (confirm("Would you like to delete this item?")) {
                    $scope.items.splice(index, 1);

                    $timeout(function () {
                        $scope.$emit("iso-method", {name: "layout", params: null});
                        item.$delete();
                    });
                }
            };

            $scope.showModal = function (item) {
                var data = item;
                var renderMap = function (lat, long) {
                    var latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));
                    var mapOptions = {
                        center: latLng,
                        zoom: 8,
                        disableDefaultUI: true
                    };

                    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                    new google.maps.Marker({
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
                    renderMap(data.attributes.latitude, data.attributes.longitude);

                }).modal('show');
            }
        });
    }]);


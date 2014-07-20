var listItemController = angular.module('listItemController', ['iso', 'nanobar']);

listItemController.controller('ListItemsCtrl', [
    '$scope', '$timeout', '$http',
    'Pusher', 'ListItem', 'Wittl', 'Sorting', 'Comment',
    function ($scope, $timeout, $http, Pusher, ListItem, Wittl, Sorting, Comment) {
        $scope.$watch("listID", function () {
            var listID = $scope.listID;
            $scope.items = null;
            $scope.newItemURL = "";
            $scope.wittlOrder = Wittl;
            $scope.view = {
                members: false,
                comments: false,
                list: true
            };

            $scope.pendingMessages = Comment.pendingMessages;
            $scope.$watch(function () {
                return Comment.pendingMessages;
            }, function (newValue, oldValue, scope) {
                if (newValue !== oldValue) {
                    $scope.pendingMessages = newValue;
                }
            });

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

            var addItem = function (item, callback) {
                Sorting.updateScores(listID, function () {
                    var existingItem = _.findWhere($scope.items, {id: item.id});
                    if (_.isUndefined(existingItem)) {
                        $scope.items.push(new ListItem.resource(item));
                        resort();
                    }

                    if (!_.isUndefined(callback)) {
                        callback();
                    }
                });
            };

            $scope.createListItem = function (e) {
                if (e) {
                    e.preventDefault();
                }

                var l = $('#new-list-item-submit').ladda();
                l.ladda('start');

                var url = this.newItemURL;
                this.newItemURL = '';

                var onSuccess = function (item) {
                    l.ladda('stop');
                    addItem(item);
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

                ListItem.toggleFavourite(item);
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
            };

            $scope.toggleTab = function (tab) {
                for(view in $scope.view) {
                    $scope.view[view] = false;
                }
                $scope.view[tab] = true;
                if(tab == 'comments') {
                    Comment.pendingMessages = 0;
                }
            };

            Pusher.subscribe('list-' + listID, 'added', addItem);
            Pusher.subscribe('list-' + listID, 'removed', function (data) {
                var itemID = parseInt(data['item_id']);
                var index = _.findIndex($scope.items, {id: itemID});
                if (index !== -1) {
                    $scope.items.splice(index, 1);
                    $timeout(function () {
                        $scope.$emit("iso-method", {name: "layout", params: null});
                    });
                }
            });
            Pusher.subscribe('list-' + listID, 'newComment', function () {
                if (!$scope.view.comments) {
                    Comment.pendingMessages++;
                }
            });

            hopscotch.registerHelper('addSuggestedItem', function (link) {
                var type = function (string) {
                    if (string.length > 0) {
                        $scope.newItemURL += string[0];
                        $scope.$apply();
                        setTimeout(function () {
                            type(string.slice(1, string.length));
                        }, 20);
                    }
                };

                type(link);
            });

            hopscotch.registerHelper('clearSuggestedItem', function () {
                $scope.newItemURL = '';
            });

        });
    }]);


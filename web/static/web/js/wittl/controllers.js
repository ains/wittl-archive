var listsController = angular.module('listsController', []);
var listItemController = angular.module('listItemController', ['iso']);
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


listItemController.controller('ListItemsCtrl', ['$scope', '$http', 'ListItem', 'Sorting',
    function ($scope, $http, ListItem, Sorting) {
        $scope.$watch("listID", function () {
            var listID = $scope.listID;
            $scope.items = [];

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
            };
            $scope.$on('sorting.update', resort);

            Sorting.updateScores(listID, function () {
                $scope.items = ListItem.query({listID: 1});
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


wittlsController.controller('WittlsCtrl', ['$scope', 'Wittls',
    function ($scope, Wittls) {
        $scope.availableWittls = [];
        $scope.wittlOptions = [];

        Wittls.all.query().$promise.then(function (data) {
            $scope.availableWittls = data;

            _.each(data, function (wittl) {
                var transFields = {};
                for (var i = 0; i < wittl.fields.length; i++) {
                    if (wittl.fields[i].type == 'text') {
                        transFields[wittl.fields[i].name] = '';
                    }
                }
                $scope.wittlOptions.push({
                    text: wittl.display_name,
                    wittl: wittl,
                    fields: transFields
                });
            });
        });

        $scope.clauses = [
            { text: 'any wittl' }
        ];

    }]);
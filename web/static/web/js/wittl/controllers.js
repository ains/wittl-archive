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
        $scope.$on('sorting.update', function (e) {
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
        });

        $scope.items = ListItem.query({listID: 1});

        $scope.createListItem = function (e) {
            e.preventDefault();

            var l = $('#new-list-item-submit').ladda();
            l.ladda('start');

            var listID = this.listID;
            var url = this.newItemURL;
            this.newItemURL = '';

            var onSuccess = function (data) {
                $scope.items.push(data);
                l.ladda('stop');
            };

            var onEror = function () {
                l.ladda('stop');
            };
            $http.post(api + '/lists/' + listID + '/items/', {url: url, list_id: listID})
                .success(onSuccess).error(onEror);
        }
    }]);


wittlsController.controller('WittlsCtrl', ['$scope', 'Wittls',
    function ($scope, Wittls) {

        $scope.availableWittls = [];
        $scope.wittlOptions = [];

        Wittls.all.query().$promise.then(function (data) {
            $scope.availableWittls = data;

            _.each(data, function (wittl) {
                $scope.wittlOptions.push({
                    text: wittl.display_name,
                    wittl: wittl,
                    fields: {}
                });
            });
        });

        $scope.clauses = [
            { text: 'any wittl', fields: {} }
        ];

        /* DEBUG */
        $scope.$watch('clauses', function (newVal, oldVal) {
            if (newVal != oldVal) {
                console.log('New:\n');
                console.log(newVal);
            }
        }, true);

    }]);

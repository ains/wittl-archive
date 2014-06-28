var listsController = angular.module('listsController', []);

listsController.controller('ListsCtrl', ['$scope', 'Lists', 'Broadcast',
    function ($scope, Lists, Broadcast) {
        $scope.lists = Lists.query();

        $scope.selectList = function (id) {
            Broadcast.addData('selectedList', id);
        };

        $scope.deleteList = function (e, index, list) {
            e.preventDefault();
            $scope.lists.splice(index, 1);
            list.$delete();
        };


    }]);

listsController.controller('ListsQuickAddCtrl', ['$scope', 'ListItem', 'Broadcast',
    function ($scope, ListItem, Broadcast) {

        $scope.addItemToList = function () {
            var data = Broadcast.getData();
            if (data.selectedList) {
                var newItem = {
                    url: $scope.item.url,
                    list: data.selectedList
                };

                var $form = $('#newItemModal');
                var l = $form.find('.ladda-button').ladda();
                l.ladda('start');

                ListItem.save(newItem, function () {
                    l.ladda('stop');
                    $form.modal('hide');
                });
            }
        };

    }]);
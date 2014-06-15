var favouritesController = angular.module('favouritesController', []);


favouritesController.controller('FavouritesCtrl', ['$scope', 'ListItem',
    function ($scope, ListItem) {
        $scope.items = ListItem.favourites.query();
        $scope.toggleFavourite = function (e, item) {
            e.stopPropagation();
            e.preventDefault();

            ListItem.toggleFavourite(item);
        };
    }]);
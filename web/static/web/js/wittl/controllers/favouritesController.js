var favouritesController = angular.module('favouritesController', []);


favouritesController.controller('FavouritesCtrl', ['$scope', 'Wittl',
    function ($scope, Wittl) {
        $scope.items = Wittl.favourites.query();
    }]);
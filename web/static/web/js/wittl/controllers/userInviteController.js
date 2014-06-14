var userInviteController = angular.module('userInviteController', []);


userInviteController.controller('UserInviteCtrl', ['$scope', 'User',
    function ($scope, User) {
        $scope.userSearch = function (query, callback) {
            User.search(query).success(function(response) {
                var selectData = _.map(response, function(user) {
                    return {
                        text: user.username,
                        value: user.id
                    }
                });
                callback(selectData);
            }).error(function() {
                callback();
            });
        }
    }]);
var userInviteController = angular.module('userInviteController', []);


userInviteController.controller('UserInviteCtrl', ['$scope', 'User',
    function ($scope, User) {
        var listID = $scope.listID;
        var ListUser = User.resource(listID);
        $scope.users = ListUser.query();

        $scope.userSearch = function (query, callback) {
            User.search(query).success(function (response) {
                var selectData = _.map(response, function (user) {
                    return {
                        text: user.username,
                        value: user.id
                    }
                });
                callback(selectData);
            }).error(function () {
                callback();
            });
        };


        $scope.inviteUser = function (selectize, userID) {
            if (!isNaN(parseInt(userID))) {
                var invitedUser = new ListUser({user_id: userID});
                invitedUser.$save(function (user) {
                    if(_.isUndefined(_.findWhere($scope.users, {id: user.id}))) {
                        $scope.users.push(user);
                    }
                    selectize.clear();
                });
            }
        }

    }]);
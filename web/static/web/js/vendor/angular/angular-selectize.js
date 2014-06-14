(function () {
    angular.module('angular-selectize', []);

    angular.module('angular-selectize').directive('selectize', function ($timeout) {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            // responsible for registering DOM listeners as well as updating the DOM
            link: function (scope, element, attrs) {
                $timeout(function () {
                    $(element).selectize({
                        persist: false,
                        create: null,
                        load: scope.userSearch
                    });
                });
            }
        };
    });

}).call(this);
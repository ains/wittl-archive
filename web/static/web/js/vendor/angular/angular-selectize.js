(function () {
    angular.module('angular-selectize', []);

    angular.module('angular-selectize').directive('selectize', function ($timeout) {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'A',
            scope: {
                selectizeLoad: "&",
                selectizeChange: "&"
            },
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var $select = $(element).selectize({
                        persist: false,
                        create: false,
                        load: scope.selectizeLoad(),
                        sortField: 'text'
                    });
                    var selectize = $select[0].selectize;
                    selectize.on('change', function(value) {
                        scope.selectizeChange()(selectize, value);
                    });
                });
            }
        };
    });

}).call(this);
var wittlsDirective = angular.module('wittlsDirective', []);
var ngDropdowns = angular.module('ngDropdowns', []);


wittlsDirective.directive('wittlParams', ['$compile',
    function ($compile) {
        var renderDirective = function (scope, el) {
            var model = scope.wittl.model;

            var prepositionHtml = '<span class="preposition">[[ wittl.model.preposition ]]</span>\n';
            var paramsHtml = "";

            // TODO: make ngRepeat instead
            angular.forEach(model.fields, function (val, key) {
                paramsHtml += '<input type=\'[[ wittl.model.fields["' + key + '"].type ]]\''
                    + 'ng-model=\'wittl.configuration["' + key + '"]\' class="param-field" value=\'[[ wittl.configuration["' + key + '"] ]]\' ng-blur="save(wittl)" placeholder="placeholder"/>\n';
            });

            el.replaceWith($compile(prepositionHtml + paramsHtml)(scope));
        };

        return {
            restrict: 'E',
            scope: {
                wittl: '='
            },
            controller: 'WittlsCtrl',
            link: function (scope, el, attr) {
                if (Object.keys(scope.wittl.model).length === 0) return;

                renderDirective(scope, el);
            }
        }
    }]);


wittlsDirective.directive('dropdownSelect', ['$document', '$compile',
    function ($document, $compile) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                dropdownSelect: '=',
                dropdownModel: '=',
                dropdownOnchange: '&'
            },
            controller: [
                '$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                    var body;
                    $scope.labelField = $attrs.dropdownItemLabel != null ? $attrs.dropdownItemLabel : 'text';
                    this.select = function (selected) {
                        if (selected !== $scope.dropdownModel) {
                            angular.copy(selected, $scope.dropdownModel);
                            $scope.dropdownModel.canSave = true;
                            $scope.dropdownModel.configuration = {};
                            $scope.dropdownModel.comparator_name = selected.model.name;
                        }
                        $scope.dropdownOnchange({
                            selected: selected
                        });
                    };

                    body = $document.find("body");
                    body.bind("click", function () {
                        $element.removeClass('active');
                    });
                    $element.bind('click', function (event) {
                        event.stopPropagation();
                        $element.toggleClass('active');
                    });

                    var first = true;

                    /* Build nl clause */
                    $scope.$watch('dropdownModel', function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            // Only exec once per dropdown
                            if (first) {
                                if (Object.keys($scope.$parent.clauses[$scope.$parent.clauses.length - 1].model).length !== 0) {
                                    $scope.$parent.clauses.push({
                                        text: 'any wittl',
                                        model: {},
                                        fields: {}
                                    });

                                    first = false;
                                }
                            }

                            $compile($element.siblings()[0])($scope.$parent);
                        }
                    }, true);
                }
            ],
            template: "<div class='wrap-dd-select'>\n    <span class='selected'>[[ dropdownModel[labelField] ]]</span>\n    <ul class='dropdown'>\n        <li ng-repeat='item in dropdownSelect'\n            class='dropdown-item'\n            dropdown-select-item='item'\n            dropdown-item-label='labelField'>\n        </li>\n    </ul>\n</div>"
        };
    }
]).directive('dropdownSelectItem', [
    function () {
        return {
            require: '^dropdownSelect',
            replace: true,
            scope: {
                dropdownItemLabel: '=',
                dropdownSelectItem: '='
            },
            link: function (scope, element, attrs, dropdownSelectCtrl) {
                scope.selectItem = function () {
                    if (scope.dropdownSelectItem.href) {
                        return;
                    }
                    element.parent().children('li.checked')
                        .each(function () {
                            $(this).removeClass('checked');
                        });
                    element.addClass('checked');
                    dropdownSelectCtrl.select(scope.dropdownSelectItem);
                };
            },
            template: "<li ng-class='{divider: dropdownSelectItem.divider}' ng-click='selectItem()'>\n    <a href='' class='dropdown-item'\n        ng-if='!dropdownSelectItem.divider'\n        ng-href='[[ dropdownSelectItem.href ]]'>\n        [[ dropdownSelectItem[dropdownItemLabel] ]]\n    </a>\n</li>"
        };
    }
]);
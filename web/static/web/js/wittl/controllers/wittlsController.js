var wittlsController = angular.module('wittlsController', []);

wittlsController.controller('WittlsCtrl', ['$scope', 'Wittl', 'Sorting',
    function ($scope, Wittl, Sorting) {
        $scope.wittlOptions = {
            'wittls': Wittl.options,
            'attrs': Wittl.attributeOptions
        };
        $scope.clauses = Wittl.wittls;

        Wittl.getConfiguration().then(function (response) {
            angular.forEach(response.data, function (wittl, key) {
                var fields = {};
                for (var i = 0; i < wittl.fields.length; i++) {
                    fields[wittl.fields[i].name] = '';
                }
                $scope.wittlOptions.wittls[key] = {
                    text: wittl.display_name,
                    model: wittl,
                    fields: fields
                };
            });
        });

        $scope.$watch('listID', function (newId) {
            if (newId) {
                Wittl.list.listID = newId;
                Wittl.list.query({listID: newId}, function (response) {
                    //Insert in reverse order as we're unshifting
                    for (var i = response.length - 1; i >= 0; i--) {
                        var activeWittl = response[i];
                        var wittl = $scope.wittlOptions.wittls[activeWittl.comparator_name];
                        var newWittl = angular.copy(activeWittl);

                        if (wittl) {
                            newWittl.text = wittl.text;
                            newWittl.model = wittl.model;
                            $scope.clauses.unshift(newWittl);
                        }

                        if (newWittl.comparator_name.indexOf("attr:") === 0) {
                            var attrName = newWittl.comparator_name.replace("attr:", "");
                            newWittl.text = attrName;
                            newWittl.model = {};
                            $scope.clauses.unshift(newWittl);
                        }
                    }

                });
            }
        });

        $scope.sortableWittlsOptions = {
            placeholder: 'wittl-droppable',
            start: function (e, ui) {
                ui.item.closest('.wittl-form').addClass('dragging');
                ui.item.addClass('wittl-dragstart');
                ui.placeholder.height(ui.item.outerHeight());
            },
            stop: function (e, ui) {
                ui.item.closest('.wittl-form').removeClass('dragging');
                ui.item.removeClass('wittl-dragstart');
                angular.forEach($scope.clauses, function (wittl, i) {
                    wittl.order = i;
                    if (!angular.isUndefined(wittl.$update)) {
                        wittl.$update();
                    }
                });
            }
        };

        $scope.save = function (updatedWittl) {
            var listID = Wittl.list.listID;
            var request;
            if (angular.isUndefined(updatedWittl.$save)) {
                var persistedWittl = new Wittl.list(updatedWittl);
                persistedWittl.list = listID;

                request = persistedWittl.$save(function (savedWittl) {
                    angular.extend(persistedWittl, savedWittl);
                    angular.extend(persistedWittl, updatedWittl);
                    angular.copy(persistedWittl, updatedWittl);
                });
            } else {
                request = updatedWittl.$update();
            }

            request.then(function () {
                Sorting.updateScores(listID);
            });
        };

        $scope.del = function (index, wittl) {
            $scope.clauses.splice(index, 1);
            if(!angular.isUndefined(wittl.$delete)) {
                wittl.$delete();
            }
        }

    }]);

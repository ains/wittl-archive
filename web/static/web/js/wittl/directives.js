var wittlsDirective = angular.module('wittlsDirective', []);
var ngDropdowns = angular.module('ngDropdowns', []);

wittlsDirective.directive('wittlNlform', function() {
		return {
			restrict: 'A',
			link: function(scope, el, attrs) {
				scope.$watch('availableWittls', function(newVal, oldVal) {
					if(newVal != oldVal) {
						var nlform = new NLForm(el[0]);						
					}
				});
			},
			controller: function($scope) {
				console.log('hi');
			}
		}
});

wittlsDirective.directive('newWittl', ['$compile', 
	function($compile) {
		return {
			restrict: 'A',
			controller: ['$scope', '$element', '$attrs',
				function($scope, $element, $attrs) {
					var model = $element.find('[dropdown-select]').attr('dropdown-model'); 
					// SUPER HACK.
					var clauseIndex = parseInt( model.replace('clauses[', '').replace(']', '') );
					var newClauseIndex = clauseIndex + 1;

					var unregister = $scope.$watch(
						model, 
						function(newVal, oldVal) {
							if(newVal != oldVal) {
								$element.removeAttr('new-wittl');

								$scope.clauses[newClauseIndex] = { text: 'any wittl', fields: {} };

								var newWittl = '<div class="wittl-conjunction">'
                        					 + 		'and'
                    						 + '</div>'
                    						 + '<li class="wittl-clause" new-wittl>'
							                 +     '<div class="wittl">'
							                 +         '<div dropdown-select="wittlOptions" dropdown-model="clauses[' + newClauseIndex + ']"></div>'
							                 +      '</div>'
							                 + '</li>';

								var el = $compile(newWittl)( $scope );
								$element.parent().append(el);

								unregister();
							}
						}, true);
				}]
		}
}]);



ngDropdowns.directive('dropdownSelect', ['$document', '$compile', 
	function($document, $compile) {
	    return {
	      restrict: 'A',
	      replace: true,
	      scope: {
	        dropdownSelect: '=',
	        dropdownModel: '=',
	        dropdownOnchange: '&'
	      },
	      controller: [
	        '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
	          var body;
	          $scope.labelField = $attrs.dropdownItemLabel != null ? $attrs.dropdownItemLabel : 'text';
	          this.select = function(selected) {
	            if (selected !== $scope.dropdownModel) { 
	              angular.copy(selected, $scope.dropdownModel);
	            }
	            $scope.dropdownOnchange({
	              selected: selected
	            });
	          };
	          body = $document.find("body");
	          body.bind("click", function() {
	            $element.removeClass('active');
	          });
	          $element.bind('click', function(event) {
	            event.stopPropagation();
	            $element.toggleClass('active');
	          });

		        /* Build nl clause */
		        $scope.$watch('dropdownModel', function(newVal, oldVal) {
					if(newVal != oldVal) {
						var wittl = newVal.wittl;
					
						var preposition = '<span class="preposition">' + wittl.preposition + '</span>\n';
		                var fields = '';
		                for(var i = 0; i < wittl.fields.length; i++) {
		                	var field = wittl.fields[i];
		                	fields += '<input type="' + field.type 
		                			+ '" ng-model="' + $attrs.dropdownModel + '.fields.' + field.name + '"'
		                			+ 'value="" placeholder="placeholder" '
		                			+ 'name="' + field.name + '" data-subline="Enter a field specific hint here."/>\n';
		                }

		                $element.siblings().remove();

		                var el = $compile(preposition + fields)( $scope );
		                $element.parent().append(el);

		                var nlform = new NLForm($element.closest('.nl-form')[0]);
		            }
				}, true);
	        }
	      ],
	      template: "<div class='wrap-dd-select'>\n    <span class='selected'>[[ dropdownModel[labelField] ]]</span>\n    <ul class='dropdown'>\n        <li ng-repeat='item in dropdownSelect'\n            class='dropdown-item'\n            dropdown-select-item='item'\n            dropdown-item-label='labelField'>\n        </li>\n    </ul>\n</div>"
	    };
	  }
]).directive('dropdownSelectItem', [
  function() {
    return {
      require: '^dropdownSelect',
      replace: true,
      scope: {
        dropdownItemLabel: '=',
        dropdownSelectItem: '='
      },
      link: function(scope, element, attrs, dropdownSelectCtrl) {
        scope.selectItem = function() {
          if (scope.dropdownSelectItem.href) {
            return;
          }
          element.parent().children('li.checked')
	          .each(function() {
	          	$(this).removeClass('checked');
	          });
          element.addClass('checked');
          dropdownSelectCtrl.select(scope.dropdownSelectItem);
        };
      },
      template: "<li ng-class='{divider: dropdownSelectItem.divider}' ng-click='selectItem()'>\n    <a href='' class='dropdown-item'\n        ng-if='!dropdownSelectItem.divider'\n        ng-href='[[ dropdownSelectItem.href ]]'>\n        [[ dropdownSelectItem[dropdownItemLabel] ]]\n    </a>\n</li>"
    };
  }
]).directive('dropdownMenu', [
  '$parse', '$compile', '$document', function($parse, $compile, $document) {
    var template;
    template = "<ul class='dropdown'>\n    <li ng-repeat='item in dropdownMenu'\n        class='dropdown-item'\n        dropdown-item-label='labelField'\n        dropdown-menu-item='item'>\n    </li>\n</ul>";
    return {
      restrict: 'A',
      replace: false,
      scope: {
        dropdownMenu: '=',
        dropdownModel: '=',
        dropdownOnchange: '&'
      },
      controller: [
        '$scope', '$element', '$attrs', function($scope, $element, $attrs) {
          var $template, $wrap, body, tpl;
          $scope.labelField = $attrs.dropdownItemLabel != null ? $attrs.dropdownItemLabel : 'text';
          $template = angular.element(template);
          $template.data('$dropdownMenuController', this);
          tpl = $compile($template)($scope);
          $wrap = angular.element("<div class='wrap-dd-menu'></div>");
          $element.replaceWith($wrap);
          $wrap.append($element);
          $wrap.append(tpl);
          this.select = function(selected) {
            if (selected !== $scope.dropdownModel) {
              angular.copy(selected, $scope.dropdownModel);
            }
            $scope.dropdownOnchange({
              selected: selected
            });
          };
          body = $document.find("body");
          body.bind("click", function() {
            tpl.removeClass('active');
          });
          $element.bind("click", function(event) {
            event.stopPropagation();
            tpl.toggleClass('active');
          });
        }
      ]
    };
  }
]).directive('dropdownMenuItem', [
  function() {
    return {
      require: '^dropdownMenu',
      replace: true,
      scope: {
        dropdownMenuItem: '=',
        dropdownItemLabel: '='
      },
      link: function(scope, element, attrs, dropdownMenuCtrl) {
        scope.selectItem = function() {
          if (scope.dropdownMenuItem.href) {
            return;
          }
          dropdownMenuCtrl.select(scope.dropdownMenuItem);
        };
      },
      template: "<li ng-class='{divider: dropdownMenuItem.divider}'>\n    <a href='' class='dropdown-item'\n        ng-if='!dropdownMenuItem.divider'\n        ng-href='[[ dropdownMenuItem.href ]]'\n        ng-click='selectItem()'>\n        [[ dropdownMenuItem[dropdownItemLabel] ]]\n    </a>\n</li>"
    };
  }
]);
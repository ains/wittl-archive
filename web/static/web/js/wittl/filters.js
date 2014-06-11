var listsFilter = angular.module('listsFilter', []);

listsFilter.filter('coverphoto', function() {
	return function(input) {
		return input ? input : "/static/web/images/emptywittlist.png";
	}
})
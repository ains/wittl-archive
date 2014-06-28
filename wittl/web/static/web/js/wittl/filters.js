var listsFilter = angular.module('listsFilter', []);

listsFilter.filter('coverphoto', function() {
	return function(input) {
		return input ? input : "/static/web/images/emptywittlist.png";
	}
});

listsFilter.filter('truncate', function() {
	return function(input, limit) {
		if(input.length <= limit) {
			return input;
		}
		return input.slice(0, limit) + "...";
	}
})
var wittl = angular.module('wittl', [
    'ngCookies',

    /* Lists
     * ------------------- */
    'listsService',
    'listsController',
    'listsFilter',

    /* List Items
     * ------------------- */
    'listItemService',
    'listItemController',

    /* Wittls
     * ------------------- */
    'wittlsService',
    'wittlsController',
    'wittlsDirective',

    /* Favourites
     * ------------------- */
    'favouritesController',

    /* User Invite
     * ------------------- */
    'userService',
    'userInviteController',

    /* Comments
     * ------------------- */
    'commentService',
    'listCommentController',

    /* Vendor
     * ------------------- */
    'ui.sortable',
    'angular-selectize',
    'doowb.angular-pusher'
]);

wittl.config(function ($httpProvider, $interpolateProvider, $resourceProvider) {

    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');

    $resourceProvider.defaults.stripTrailingSlashes = false;

}).run(function ($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = $cookies.csrftoken;
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
}).filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}).config(['PusherServiceProvider',
    function (PusherServiceProvider) {
        PusherServiceProvider
            .setToken('8900b5ba3afa0a3d9552')
            .setOptions({});
    }
]);

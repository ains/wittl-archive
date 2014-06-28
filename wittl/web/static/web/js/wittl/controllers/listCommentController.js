var listCommentController = angular.module('listCommentController', []);


listCommentController.controller('ListCommentCtrl', ['$scope', 'Comment', 'Pusher',
    function ($scope, Comment, Pusher) {
        var listID = $scope.listID;
        var CommentResource = Comment.resource(listID);
        $scope.comments = CommentResource.query();
        $scope.pendingMessages = Comment.pendingMessages;

        var addComment = function (comment) {
            if (_.findIndex($scope.comments, {id: comment.id}) === -1) {
                $scope.comments.push(comment);
            }
        };

        $scope.checkSubmit = function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                var newComment = new CommentResource({body: this.commentText});
                newComment.$save(addComment);

                this.commentText = '';
            }
        };

        Pusher.subscribe('list-' + listID, 'newComment', addComment);
    }]);
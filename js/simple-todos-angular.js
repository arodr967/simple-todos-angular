Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {

    /* Configure accounts UI to use usernames instead of email */
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });

  // This code only runs on the client
    angular.module('simple-todos',['angular-meteor', 'accounts.ui']);

    angular.module('simple-todos').controller('TodosListCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {

      $scope.tasks = $meteor.collection(function() {
        return Tasks.find($scope.getReactively('query'), {sort: {createdAt: -1}})
      });

      $scope.addTask = function(newTask) {
        $scope.tasks.push( {
            text: newTask,
            createdAt: new Date(),             // current time
            owner: Meteor.userId(),            // _id of logged in user
            username: Meteor.user().username  // username of logged in user
          });
      };

      $scope.$watch('hideCompleted', function() {
        if ($scope.hideCompleted)
          $scope.query = {checked: {$ne: true}};
        else
          $scope.query = {};
      });

      $scope.incompleteCount = function () {
        var count = Tasks.find({ checked: {$ne: true} }).count();
          if(count > 0) {
            return count;
          } else {
            return "DONE!";
          }
      };

      //end of controller
    }]);
  }

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

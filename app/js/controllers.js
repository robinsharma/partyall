'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('HomeCtrl', ['$scope', 
    function($scope) {

  }])
  .controller('LoginHostCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.formData = {};

  }])  
  .controller('CreatePartyCtrl', ['$scope', '$http', 
    function($scope, $http) {
        $scope.formData = {};
        this.createParty = function() {
            console.log('TODO make request');
        };

  }])
  .controller('LoginGuestCtrl', ['$scope', 
    function($scope) {

  }])
  .controller('LoginSuccessCtrl', ['$scope', 
    function($scope) {

  }]);

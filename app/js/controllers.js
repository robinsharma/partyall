'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('HomeCtrl', ['$scope', 
    function($scope) {

  }])

  .controller('HostLoginCtrl', ['$scope', '$rootScope', 
    function($scope, $rootScope) {

  }])  

  .controller('CreatePartyCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService',
    function($scope, $rootScope, AUTH_EVENTS, AuthService) {
      $scope.credentials = {
        partyName: '',
        password: '',
        confirmedPassword: ''
      };
      //TODO validate passwords, provide visual feedback
      $scope.createParty = function(credentials) {
        console.log(credentials);
        console.log(AuthService.create(credentials));
      }
  }])

  .controller('GuestLoginCtrl', ['$scope', 
    function($scope) {

  }])

  .controller('CreateSuccessCtrl', ['$scope', 
    function($scope) {

  }]);

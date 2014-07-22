'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('MainAppCtrl', ['$scope', 'USER_TYPES', 'AuthService',
    function($scope, USER_TYPES, AuthService) {
      $scope.currentUser = null;
      $scope.userType = USER_TYPES;
      $scope.isAuthorized = AuthService.isAuthorized;

      $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
      };
  }])

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
        AuthService.create(credentials).then(function (data) {
          $rootScope.$on('host-login-success', function (event) { //this is how we will listen for certain events
            alert('login success ' + $scope.currentUser);
          });
          $rootScope.$broadcast(AUTH_EVENTS.hostLoginSuccess);
          $scope.setCurrentUser(data);
        }, function () { //if auth failed
          $rootScope.$broadcast(AUTH_EVENTS.hostLoginFailed);
        });
      };
  }])

  .controller('GuestLoginCtrl', ['$scope', 
    function($scope) {

  }])

  .controller('CreateSuccessCtrl', ['$scope', 
    function($scope) {

  }]);

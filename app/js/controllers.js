'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('MainAppCtrl', ['$scope', 'USER_TYPES', 'AuthService',
    function($scope, USER_TYPES, AuthService) {
      $scope.currentUserData = null;
      //following two are for providing easy access to USER_TYPES and isAuthorized
      $scope.userTypes = USER_TYPES;
      $scope.isAuthorized = AuthService.isAuthorized;

      $scope.setCurrentUserData = function (user) {
        $scope.currentUserData = user;
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
      $rootScope.$on(AUTH_EVENTS.hostLoginSuccess, function (event) { //this is how we will listen for certain events
        alert('login success ' + JSON.stringify($scope.currentUserData));
      });
      $scope.createParty = function(credentials) {
        console.log(credentials);
        AuthService.create(credentials).then(function (data) {
          $scope.setCurrentUserData(data);
          $rootScope.$broadcast(AUTH_EVENTS.hostLoginSuccess);
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

  }])

  .controller('PartyCtrl', ['$scope',
      function($scope){
        //TODO
  }]);

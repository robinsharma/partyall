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

  .controller('CreatePartyCtrl', ['$scope', '$rootScope', '$location', 'PARTY_EVENTS', 'PartyService',
    function($scope, $rootScope, $location, PARTY_EVENTS, PartyService) {
      $scope.credentials = {
        partyName: '',
        password: '',
        confirmedPassword: ''
      };
      //TODO validate passwords, provide visual feedback
      
      $rootScope.$on(PARTY_EVENTS.partyCreateSuccess, function (event) { //this is how we will listen for certain events
        $location.path('/create/success');
      });

      $rootScope.$on(PARTY_EVENTS.partyCreateFailure, function (event) {
        console.log("Party create fail event");
        // to-do handle failure
      });

      $scope.createParty = function(credentials) {
        console.log(credentials);
        PartyService.create(credentials);
      };

  }])

  .controller('GuestLoginCtrl', ['$scope', 
    function($scope) {

  }])

  .controller('CreateSuccessCtrl', ['$scope', 'PartyService',
    function($scope, PartyService) {
      $scope.party = PartyService.party;
  }])

  .controller('PartyCtrl', ['$scope', 'PartyService',
    function($scope, PartyService){
      $scope.party = PartyService.party;
  }]);

'use strict';


// Declare app level module which depends on filters, and services
angular.module('partyAll', [
  'ngRoute',
  'partyAll.filters',
  'partyAll.services',
  'partyAll.directives',
  'partyAll.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/login/host', {
    templateUrl: 'partials/login-host.html', 
    controller: 'LoginHostCtrl'
  });
  $routeProvider.when('/login/guest', {
    templateUrl: 'partials/login-guest.html', 
    controller: 'LoginGuestCtrl'
  });
  $routeProvider.when('/login/success', {
    templateUrl: 'partials/login-success.html', 
    controller: 'LoginSuccessCtrl'
  });
  // $routeProvider.when('/party/:userType/:partyId', {templateUrl: 'partials/party.html', controller: 'PartyCtrl'});
  // $routeProvider.when('/party/:userType/:partyId/search', {templateUrl: 'partials/search.html', controller: 'SearchCtrl'});
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}]);

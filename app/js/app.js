'use strict';


// Declare app level module which depends on filters, and services
angular.module('partyAll', [
  'ngRoute',
  'partyAll.filters',
  'partyAll.services',
  'partyAll.directives',
  'partyAll.constants',
  'partyAll.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/home.html', 
    controller: 'HomeCtrl'
  });
  $routeProvider.when('/login/host', {
    templateUrl: 'partials/login-host.html'
  });
  $routeProvider.when('/login/guest', {
    templateUrl: 'partials/login-guest.html'
  });
  $routeProvider.when('/create/success', {
    templateUrl: 'partials/create-success.html', 
    controller: 'CreateSuccessCtrl'
  });
  $routeProvider.when('/party/:partyId', {
    templateUrl: 'partials/party.html', 
    controller: 'PartyCtrl'
  });
  // $routeProvider.when('/party/:userType/:partyId/search', {templateUrl: 'partials/search.html', controller: 'SearchCtrl'});
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}]);

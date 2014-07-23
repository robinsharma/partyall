'use strict';


// Declare app level module which depends on filters, and services
angular.module('partyAll', [
  'ngRoute',
  'partyAll.filters',
  'partyAll.services',
  'partyAll.directives',
  'partyAll.constants',
  'partyAll.controllers'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'partials/home.html', 
    controller: 'HomeCtrl',
    authRequired: false
  });
  $routeProvider.when('/login/host', {
    templateUrl: 'partials/login-host.html',
    authRequired: false
  });
  $routeProvider.when('/login/guest', {
    templateUrl: 'partials/login-guest.html',
    authRequired: false
  });
  $routeProvider.when('/create/success', {
    templateUrl: 'partials/create-success.html', 
    controller: 'CreateSuccessCtrl',
    authRequired: true
  });
  $routeProvider.when('/party/:partyId', {
    templateUrl: 'partials/party.html', 
    controller: 'PartyCtrl',
    authRequired: true
  });
  // $routeProvider.when('/party/:userType/:partyId/search', {templateUrl: 'partials/search.html', controller: 'SearchCtrl'});
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}])
.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
  $rootScope.$on('$routeChangeStart', function (event, next) {

    // does page require auth?
    if (next.authRequired) {
      if (!AuthService.hasAuth()) {
        console.log("DISALLOW: not logged in");
        event.preventDefault();
        $location.path('/');
      } else {
        console.log("Allow: logged in");
      }
      
    } else {
      console.log("ALLOW: don't need auth");
    }

  });
}]);

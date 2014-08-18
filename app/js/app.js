'use strict';


// Declare app level module which depends on filters, and services
angular.module('partyAll', [
  'ngRoute',
  'partyAll.filters',
  'partyAll.services',
  'partyAll.directives',
  'partyAll.constants',
  'partyAll.controllers',
  'ngStorage',
  'ngAnimate'
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
  $routeProvider.when('/party/:partyKey/success', {
    templateUrl: 'partials/create-success.html', 
    controller: 'CreateSuccessCtrl',
    authRequired: true
  });
  $routeProvider.when('/party/:partyKey', {
    templateUrl: 'partials/party.html', 
    controller: 'PartyCtrl',
    authRequired: true
  });
  $routeProvider.when('/party/:partyKey/search', {
    templateUrl: 'partials/search.html',
    controller: 'SearchCtrl',
    authRequired: true
  });
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}])
.run(['$rootScope', '$location','AuthService', 'Session', function($rootScope, $location, AuthService, Session) {
  Session.init();
  
  $rootScope.$on('$routeChangeStart', function (event, next) {

    // Requires auth but not logged in
    if (next.authRequired && !AuthService.hasAuth()) {
        event.preventDefault();
        $location.path('/');
    
    // Requires auth but you don't have access
    } else if (next.authRequired && !AuthService.hasAccess(next.params.partyKey)) {
      event.preventDefault();
      $location.path('/party/' + Session.partyKey);

    // Does not require auth and you are already logged in (i.e. home or login pages)
    } else if (!next.authRequired && AuthService.hasAuth()) {
      event.preventDefault();
      $location.path('/party/' + Session.partyKey);
    }

    // else don't intercept default action

  });

}]);

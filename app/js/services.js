'use strict';

/* Services */

angular.module('partyAll.services', [])

  /*
  Factory service used to decouple controllers from authentication logic.
  This service responsible for retrieving authentication information, and verifying if a user
  has already authorized and/or has certain permission.
  */
  .factory('AuthService', ['$http', 'Session', function($http, Session) {
    var authService = {};

    authService.create = function(credentials) {
      return $http
        .post('//TODO', credentials)
        .then(function(response) {
          Session.create(response.party_key, response.user.user_id, response.user.user_type);
          return response;
        });
    };
    authService.hasAuth = function () {
      return !!Session.userId;
    };
    authService.isAuthorized = function (authType) { //TODO change to hasPermission()??
      return (authService.hasAuth() && authType === Session.userType); // Check if user is authorized and has that level of permission
    };

    return authService;
  }])

  /*
  Service used for managing user sessions and initiating user variables that will be used
  to determine type and permissions of users.
  */
  .service('Session', function () {
    this.create = function(partyKey, userId, userType) {
      this.partyKey = partyKey;
      this.userId   = userId;
      this.userType = userType;
    };
    this.destroy = function () {
      this.partyKey = null;
      this.userId   = null;
      this.userType = null;
    };
    return this;
  });


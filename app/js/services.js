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
        .get('sample_data/sample_create_data.json', credentials) //TODO sign requests, change to post and response.data to reponse
        .then( function (response) {
          console.log(response);
          Session.create(response.data.party_key, response.data.user.user_id, response.data.user.user_type);
          return response.data;
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


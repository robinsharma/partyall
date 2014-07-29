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

    authService.hasAuth = function () {
      return !!Session.userId;
    };
    authService.isAuthorized = function (authType) { //TODO change to hasPermission()??
      return (authService.hasAuth() && authType === Session.userType); // Check if user is authorized and has that level of permission
    };

    return authService;
  }])

  .service('PartyService', ['$http', '$rootScope', 'Session', 'PARTY_EVENTS', function($http, $rootScope, Session, PARTY_EVENTS) {    
    this.init = function(party) {
      var partyService = this;
      this.party = party;
      this.queue = [];
      console.log('INIT');

      $http
      .get('https://partyall-service.appspot.com/party/queue/?party_key=' + party.party_key)
      .success(function (queue) {
        partyService.queue = queue;
        $rootScope.$broadcast(PARTY_EVENTS.partyQueueInit, queue);
      });
              
    };

    this.populateParty = function(party, callback) {
      var partyService = this;

      $http
      .get('http://api.soundcloud.com' + '/tracks' + '?client_id=11c11021d4d8721cf1970667907f45d6' + '&q=kygo')
      .success(function (tracks) {
        console.log('success get tracks');

        tracks.forEach(function (track) {

          var params = {
            data      : track,
            party_key : party.party_key,
            url       : track.stream_url,
            user_id   : Session.userId,
          };

          console.log(track);
          $http
          .post('https://partyall-service.appspot.com/party/song/add/', params)
          .success(function (data) {
            console.log('successfully added: ');
            console.log(data);
          });
        });
        callback();
      });

    };

    this.getQueue = function() {
      return this.queue;
    };

    this.nextSong = function() {
      return this.queue.pop();
    };


    // todo - persistent connection to party service to update party
    return this;
  }])

  /*
  Service used for managing user sessions and initiating user variables that will be used
  to determine type and permissions of users.
  */
  .service('Session', ['$rootScope', 'AUTH_EVENTS', 'USER_TYPES', function($rootScope, AUTH_EVENTS, USER_TYPES) {
    this.create = function(partyKey, userId, userType) {
      this.partyKey = partyKey;
      this.userId   = userId;
      this.userType = userType;

      // Broadcast login success event (since session created)
      if (userType === USER_TYPES.host) {
        $rootScope.$broadcast(AUTH_EVENTS.hostLoginSuccess);
      } else {
        $rootScope.$broadcast(AUTH_EVENTS.guestLoginSuccess);
      }
    };

    this.destroy = function () {
      this.partyKey = null;
      this.userId   = null;
      this.userType = null;

      // todo- broadcast logout events
    };

    return this;
  }]);


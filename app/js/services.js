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

  .service('PartyService', ['$http', '$rootScope', 'USER_TYPES', 'PARTY_EVENTS', function($http, $rootScope, USER_TYPES, PARTY_EVENTS) {    
    this.create = function (credentials) {
      var partyService = this;
      $http
      .post('https://partyall-service.appspot.com/party/create', { name: credentials.partyName, password: credentials.password }) //TODO sign requests, change to post and response.data to reponse)
      .then(function (response) {
        console.log('response');
        console.log(response);

        if (response.status === 200) {
          partyService.party = response.data.party;
          console.log(response.data);
          $rootScope.$broadcast(PARTY_EVENTS.partyCreateSuccess, partyService.party.party_key, response.data.user, USER_TYPES.host);
        } else {
          $rootScope.$broadcast(PARTY_EVENTS.partyCreateFailure);
        }  

      });
    };

    this.init = function() {
      var partyService = this;
      // init with soundcloud sounds for testing
      $http
      .get('http://api.soundcloud.com' + '/tracks' + '?client_id=11c11021d4d8721cf1970667907f45d6' + '&q=kygo')
      .success(function (tracks) {
        partyService.queue = tracks;
        $rootScope.$broadcast(PARTY_EVENTS.partyQueueUpdate);
        // tracks.forEach(function (track) {
        //   console.log(track);
        //   $http
        //   .post('https://partyall-service.appspot.com/party/song/add/'
        //     + '?party_key=' + partyService.party.party_key
        //     + '&url='       + encodeURIComponent(track.stream_url)
        //     + '&user_id='   + Session.userId,
        //     track)
        //   .success(function (data) {
        //     console.log('successfully added: ');
        //     console.log(data);
        //   });
        // });
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
  .service('Session', ['$rootScope', 'PartyService', 'AUTH_EVENTS', 'USER_TYPES', function($rootScope, PartyService, AUTH_EVENTS, USER_TYPES) {
    this.create = function(partyKey, userId, userType) {
      PartyService.init();

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


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

  .factory('BackendService', ['$http', 'Session', 'USER_TYPES', function($http, Session, USER_TYPES) {
    var backendService = {};
    var baseUrl = 'https://partyall-service.appspot.com';

    backendService.login = function (path, userType, data, callback) {
      var params = {
        party_key  : data.partyKey,
        party_name : data.partyName || "",
        password   : data.password || ""
      };

      $http
      .post(baseUrl + path, params) //TODO sign requests, change to post and response.data to reponse)
      .success(function (response) {
        Session.create(response.party.party_key, response.user, userType, response.party.name, response.token);
        callback({success: true, partyKey: response.party.party_key});
      })
      .error(function (error) {
        callback({success: false, error: error});
      });
    };

    backendService.guestLogin = function (credentials, callback) {
      backendService.login('/party/access', USER_TYPES.guest, credentials, callback);
    };

    backendService.hostLogin = function (credentials, callback) {
      backendService.login('/party/login', USER_TYPES.host, credentials, callback);
    };

    backendService.createParty = function (formData, callback) {
      backendService.login('/party/create', USER_TYPES.host, formData, callback);
    };

    backendService.nextSong = function() {
      var params = {
        party_key   : Session.partyKey,
        user_id     : Session.userId
      };
      
      $http
      .post(baseUrl+'/party/song/next/', params)
      .success(function (song) {
        console.log('Next Song API: success');
      })
      .error(function (error) {
        console.log('Next Song API: failure');
        console.log(error);
      });
    };

    backendService.getQueue = function(callback) {
      $http
      .get(baseUrl+'/party/queue/?party_key='+Session.partyKey)
      .success(function (queue) {
        console.log('sucessfully get queue');
        callback(queue);
      });
    };

    backendService.addSong = function (url, title, description, artist, artwork) {
      var params = {
        party_key   : Session.partyKey,
        user_id     : Session.userId,
        url         : url,
        title       : title,
        description : description,
        artist      : artist,
        artwork     : artwork
      };

      $http
      .post(baseUrl+'/party/song/add/', params)
      .success(function (song) {
        console.log('Add Song API: success');
      })
      .error(function (error) {
        console.log('Add Song API: failure');
        console.log(error);
      });     
    };

    return backendService;
  }])

  .factory('QueueService', ['$http', '$rootScope', 'Session', 'BackendService', 'PARTY_EVENTS', function($http, $rootScope, Session, BackendService, PARTY_EVENTS) {
    var queueService = {};
    queueService.queue = null;

    queueService.nowPlaying = function() {
      if (!queueService.queue) return;

      return queueService.queue[0];
    };

    queueService.getStaticSongs = function() {
      $http
      .get('/sample_data/queue.json')
      .success(function (songs) {
        console.log('static songs');
        console.log(songs);
        $rootScope.$broadcast(PARTY_EVENTS.staticSongs, songs);
      });
    };

    // initialize queue
    BackendService.getQueue(function (queue) {
      queueService.queue = queue;
      $rootScope.$broadcast(PARTY_EVENTS.partyQueueInit, queueService.queue);
    });

    var channel = new goog.appengine.Channel(Session.channelToken);
    var socket = channel.open();

    socket.onopen = function() {
      console.log('socket onopen');
    };

    socket.onmessage = function (message) {
      console.log('socket onmessage');
      var msg = JSON.parse(message.data);
      console.log(msg);
      queueService.queue = msg.queue;
      if (msg.now_playing_changed) {
        $rootScope.$broadcast(PARTY_EVENTS.nowPlayingChanged, queueService.queue);
      }
      $rootScope.$broadcast(PARTY_EVENTS.partyQueueUpdate, queueService.queue);
    };

    socket.onerror = function (error) {
      console.log('socket onerror:' + error);
      //todo
    };

    socket.onclose = function () {
      console.log('socket onclose');
      // todo -- open a new socket / reopen
    };



    return queueService;
  }])

  /*
  Service used for managing user sessions and initiating user variables that will be used
  to determine type and permissions of users.
  */
  .service('Session', ['$rootScope', 'AUTH_EVENTS', 'USER_TYPES', function($rootScope, AUTH_EVENTS, USER_TYPES) {
    this.create = function(partyKey, userId, userType, partyName, channelToken) {
      this.partyKey = partyKey;
      this.userId   = userId;
      this.userType = userType;
      this.partyName = partyName;
      this.channelToken = channelToken;

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
      this.partyName = null;
      this.channelToken = null;

      // todo- broadcast logout events
    };

    return this;
  }]);
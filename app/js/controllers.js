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

  .controller('HostLoginCtrl', ['$scope', '$http', '$location', 'PartyService', 'Session', 'USER_TYPES',
    function($scope, $http, $location, PartyService, Session, USER_TYPES) {
      $scope.credentials = {
        partyKey: '',
        password: ''
      };

      $scope.login = function(credentials) {
        
        $http
        .post('https://partyall-service.appspot.com/party/login', { party_key: credentials.partyKey, password: credentials.password }) //TODO sign requests, change to post and response.data to reponse)
        .success(function (response) {
          console.log('response');
          console.log(response); 
          Session.create(response.party.party_key, response.user, USER_TYPES.host);
          PartyService.init(response.party);
          $location.path('/party/'+response.party.party_key);
        })
        .error(function (error) {
          // todo
        });

      };

  }])  

  .controller('CreatePartyCtrl', ['$scope', '$http', '$location', 'PartyService', 'Session', 'USER_TYPES',
    function($scope, $http, $location, PartyService, Session, USER_TYPES) {
      $scope.formData = {
        partyName: '',
        password: '',
        confirmedPassword: ''
      };
      //TODO validate passwords, provide visual feedback

      $scope.createParty = function(formData) {
        console.log(formData);
        
        $http
        .post('https://partyall-service.appspot.com/party/create', { name: formData.partyName, password: formData.password }) //TODO sign requests, change to post and response.data to reponse)
        .success(function (response) {
          console.log('response');
          console.log(response);
          Session.create(response.party.party_key, response.user, USER_TYPES.host);

          // prepopulate party with soundcloud songs for testing
          PartyService.populateParty(response.party, function() {
            PartyService.init(response.party);
            $location.path('/create/success');
          });

        })
        .error(function (error) {
          // todo
        });

      };

  }])

  .controller('GuestLoginCtrl', ['$scope', '$http', '$location', 'PartyService', 'Session', 'USER_TYPES',
    function($scope, $http, $location, PartyService, Session, USER_TYPES) {
      $scope.credentials = {
        partyKey: ''
      };

      $scope.login = function(credentials) {
        
        $http
        .post('https://partyall-service.appspot.com/party/access', { party_key: credentials.partyKey }) //TODO sign requests, change to post and response.data to reponse)
        .success(function (response) {
          console.log('response');
          console.log(response); 
          Session.create(response.party.party_key, response.user, USER_TYPES.guest);
          PartyService.init(response.party);
          $location.path('/party/'+response.party.party_key);
        })
        .error(function (error) {
          // todo
        });

      };

  }])

  .controller('CreateSuccessCtrl', ['$scope', 'PartyService',
    function($scope, PartyService) {
      $scope.party = PartyService.party;
  }])

  .controller('PartyCtrl', ['$scope', '$rootScope', 'PartyService', 'Session', 'USER_TYPES', 'PARTY_EVENTS',
    function($scope, $rootScope, PartyService, Session, USER_TYPES, PARTY_EVENTS){
      $scope.party = PartyService.party;
      $scope.user = { type: Session.userType, id: Session.userId };
      $scope.queue = PartyService.getQueue();

      //init
      $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event, tracks) {
        $scope.queue = tracks;
      });

      //update
      $rootScope.$on(PARTY_EVENTS.partyQueueUpdate, function (event, tracks) {
        $scope.queue = tracks;
      });

      $scope.isHost = function() {
        return Session.userType === USER_TYPES.host;
      };

      $scope.nowPlaying = function() {
        return $scope.queue.length > 0;
      };
      
  }])

.controller('PlayerCtrl', ['$scope', '$rootScope', '$http', '$document', '$interval', 'PartyService', 'PARTY_EVENTS',
  function($scope, $rootScope, $http, $document, $interval, PartyService, PARTY_EVENTS) {

    $scope.playerControl = function () {
      if (!$scope.isPlaying) {
        if (audio.getAttribute('src') === null) {
          setPlayer();
        }
        audio.play();
        $scope.isPlaying = true;
        timer = $interval(updateTime, 1000);
      } else {
        audio.pause();
        $scope.isPlaying = false;
        $interval.cancel(timer);
      }
    };

    $scope.nextSong = function () {
      song = PartyService.nextSong();
      $interval.cancel(timer);
      setPlayer();
      audio.play();
      $scope.isPlaying = true;
      timer = $interval(updateTime, 1000);  
    };

    var setPlayer = function () {
      $scope.timeWidth = "0%";
      $scope.artwork = song.data.artwork_url;
      $scope.title = song.data.title;
      $scope.artist = song.data.user.username;
      audio.src = song.data.stream_url + '?client_id=11c11021d4d8721cf1970667907f45d6';
    };

    var updateTime = function() {
      $scope.timeWidth = parseInt(audio.currentTime * 100 / audio.duration) + "%";
    };

    $scope.artwork = null;
    $scope.title = null;
    $scope.artist = null;
    $scope.isPlaying = false;
    $scope.timeWidth = null;
    var song = PartyService.nextSong();
    var audio = $document[0].querySelector('#player');
    var timer;

    //init
    if (song) $scope.playerControl(); 
    $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event) {
      song = PartyService.nextSong();
      if (song) {
        $scope.playerControl();  
      } 
    });

    audio.addEventListener('ended', function () {
      $scope.$apply($scope.nextSong());
    });

}]);

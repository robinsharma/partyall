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
  
  .controller('CreatePartyCtrl', ['$scope', '$location', 'BackendService',
    function($scope, $location, BackendService) {
      $scope.formData = {
        partyName: '',
        password: '',
        confirmedPassword: ''
      };
      
      //TODO validate passwords, provide visual feedback

      $scope.createParty = function(formData) {
        BackendService.createParty(formData, function (response) {
          if (response.success) {
            $location.path('/create/success');
          } else {
            // todo
          }
        });
      };
  }])

  .controller('HostLoginCtrl', ['$scope', '$location', 'BackendService',
    function($scope, $location, BackendService) {
      $scope.credentials = {
        partyKey: '',
        password: ''
      };

      $scope.login = function(credentials) {
        BackendService.hostLogin(credentials, function (response) {
          if (response.success) {
            $location.path('/party/'+response.partyKey);
          } else {
            // todo
          }
        });
      };
  }])

  .controller('GuestLoginCtrl', ['$scope', '$location', 'BackendService',
    function($scope, $location, BackendService) {
      $scope.credentials = {
        partyKey: ''
      };

      $scope.login = function(credentials) {
        BackendService.guestLogin(credentials, function (response) {
          if (response.success) {
            $location.path('/party/'+response.partyKey);
          } else {
            // todo
          }
        });
      };
  }])

  .controller('CreateSuccessCtrl', ['$scope', 'Session',
    function($scope, Session) {
      $scope.partyName = Session.partyName;
      $scope.partyKey = Session.partyKey;
  }])

  .controller('PartyCtrl', ['$scope', '$rootScope', 'QueueService', 'Session', 'USER_TYPES', 'PARTY_EVENTS',
    function($scope, $rootScope, QueueService, Session, USER_TYPES, PARTY_EVENTS){
      $scope.partyName = Session.partyName;
      $scope.queue = null;
      $scope.nowPlaying = null;
      $scope.staticSongs = null;

      //init
      $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event, queue) {
        console.log('queue init');
        $scope.queue = queue.slice(1);
        $scope.nowPlaying = queue[0];
      });

      //update
      $rootScope.$on(PARTY_EVENTS.partyQueueUpdate, function (event, queue) {
        console.log('update event in party ctrl');
        console.log(queue);
        $scope.queue = queue.slice(1);
        $scope.nowPlaying = queue[0];
      });

      $scope.isHost = function() {
        return Session.userType === USER_TYPES.host;
      };

      $scope.addSong = function(song) {
        console.log(song);
        QueueService.addSong(song);
      };

      //dev
      $rootScope.$on(PARTY_EVENTS.staticSongs, function (event, staticSongs) {
        $scope.staticSongs = staticSongs;
      });

      QueueService.getStaticSongs();
      
  }])

.controller('PlayerCtrl', ['$scope', '$rootScope', '$document', '$interval', '$sce', 'QueueService', 'BackendService', 'PARTY_EVENTS',
  function($scope, $rootScope, $document, $interval, $sce, QueueService, BackendService, PARTY_EVENTS) {

    var clientIdParam = '?client_id=11c11021d4d8721cf1970667907f45d6';

    $scope.playerControl = function () {
      if (!$scope.isPlaying) {
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
      $interval.cancel(timer);
      BackendService.nextSong();
    };

    var setPlayer = function () {
      if ($scope.song = QueueService.nowPlaying()) {
        $scope.timeWidth = "0%";
        $scope.streamUrl = $sce.trustAsResourceUrl($scope.song.url + clientIdParam);
        $scope.timeWidth = "0%";
        $scope.isPlaying = true;
        timer = $interval(updateTime, 1000);        
      }
    };

    var updateTime = function() {
      $scope.timeWidth = parseInt(audio.currentTime * 100 / audio.duration) + "%";
    };

    $scope.isPlaying = false;
    $scope.timeWidth = "0%";
    $scope.disableNext = true;
    $scope.song = null;
    $scope.streamUrl = null;
    var audio = $document[0].querySelector('#player');
    var timer;

    $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event) {
      setPlayer();
    });

    $rootScope.$on(PARTY_EVENTS.nowPlayingChanged, function (event, queue) {
      console.log('now playing changed event');
      setPlayer();  
    });

    audio.addEventListener('ended', function () {
      $scope.nextSong();
    });

}]);

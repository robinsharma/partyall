'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('MainAppCtrl', ['$scope', '$sce', 'USER_TYPES', 'AuthService', 'Session',
    function($scope, $sce, USER_TYPES, AuthService, Session) {
      $scope.currentUserData = null;
      //following two are for providing easy access to USER_TYPES and isAuthorized
      $scope.userTypes = USER_TYPES;
      $scope.isAuthorized = AuthService.isAuthorized;

      $scope.setCurrentUserData = function (user) {
        $scope.currentUserData = user;
      };
      $scope.streamUrl = null;

      $scope.setStreamUrl = function(url) {
        console.log('set stream url');
        $scope.streamUrl = $sce.trustAsResourceUrl(url);
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

  .controller('SearchCtrl', ['$scope', '$rootScope', '$window', 'BackendService', 'SearchService', 'SEARCH_EVENTS',
    function($scope, $rootScope, $window, BackendService, SearchService, SEARCH_EVENTS) {
      $scope.query = "";
      $scope.results = null;

      $scope.search = function(query) {
        SearchService.search(query);
      };

      $scope.requestSong = function (song) {
        console.log(song);
        BackendService.addSong(song.stream_url, song.title, song.description, song.user.username, song.artwork_url);
        $window.history.back();
      };

      $rootScope.$on(SEARCH_EVENTS.searchSuccess, function (event, tracks) {
        console.log("RESULTS SUCCESS");
        console.log(tracks);
        $scope.results = tracks;
      });
  }])

  .controller('PartyCtrl', ['$scope', '$rootScope', '$location', 'QueueService', 'Session', 'PARTY_EVENTS', 'BackendService',
    function($scope, $rootScope, $location, QueueService, Session, PARTY_EVENTS, BackendService){
      console.log("party controller");
      $scope.partyName = Session.partyName;
      $scope.queue = QueueService.queue;
      $scope.nowPlaying = QueueService.nowPlaying;
      $scope.staticSongs = null;
      $scope.isHost = Session.isHost();

      //init
      console.log('QUEUE SERVICE VARS');
      console.log(QueueService.queue);
      console.log(QueueService.nowPlaying);

      $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event, queue, nowPlaying) {
        console.log('queue init');
        $scope.queue = queue;
        $scope.nowPlaying = nowPlaying;
      });

      //update
      $rootScope.$on(PARTY_EVENTS.partyQueueUpdate, function (event, queue, nowPlaying) {
        console.log('update event in party ctrl');
        console.log(queue);
        $scope.queue = queue;
        $scope.nowPlaying = nowPlaying;
        console.log(nowPlaying);
        $scope.$apply();
      });

      $scope.addSong = function(song) {
        console.log(song);
        BackendService.addSong(song.url, song.title, song.description, song.artist, song.artwork);
      };

      $scope.toggleVote = function(song) {
        console.log('vote/unvote');
        BackendService.vote(song.id);
      };

      $scope.navToSearch = function() {
        $location.path('/party/'+Session.partyKey+'/search');
      };

      $scope.hasVote = function(song) {
        if (song.voters.indexOf(Session.userId) > -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.playNow = function(song) {
        BackendService.playNow(song.id);
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
        QueueService.isPlaying = true;
        timer = $interval(updateTime, 1000);
      } else {
        audio.pause();
        $scope.isPlaying = false;
        QueueService.isPlaying = false;
        $interval.cancel(timer);
      }
    };

    $scope.nextSong = function () {
      $interval.cancel(timer);
      BackendService.nextSong();
    };

    var setPlayer = function () {
      if ($scope.song = QueueService.nowPlaying) {
        $scope.timeWidth = "0%";
        $scope.setStreamUrl($scope.song.url + clientIdParam);
        $scope.timeWidth = "0%";
        $scope.isPlaying = true;
        QueueService.isPlaying = true;
        timer = $interval(updateTime, 1000);        
      }
    };

    var updateTime = function() {
      $scope.timeWidth = parseInt(audio.currentTime * 100 / audio.duration) + "%";
    };

    $scope.isPlaying = QueueService.isPlaying;
    $scope.timeWidth = "0%";
    $scope.disableNext = true;
    $scope.song = QueueService.nowPlaying;
    var audio = $document[0].querySelector('#audio');
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

    setPlayer();

}]);

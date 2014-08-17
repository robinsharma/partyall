'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('MainAppCtrl', ['$scope', '$sce', '$document', 'BackendService', 'USER_TYPES', 'AuthService', 'Session',
    function($scope, $sce, $document, BackendService, USER_TYPES, AuthService, Session) {
      $scope.currentUserData = null;
      //following two are for providing easy access to USER_TYPES and isAuthorized
      $scope.userTypes = USER_TYPES;
      $scope.isAuthorized = AuthService.isAuthorized;
      var audio = $document[0].querySelector('#audio');

      $scope.setCurrentUserData = function (user) {
        $scope.currentUserData = user;
      };
      $scope.streamUrl = null;

      $scope.setStreamUrl = function(url) {
        console.log('set stream url');
        $scope.streamUrl = $sce.trustAsResourceUrl(url);
      };

      $scope.nextSong = function() {
        BackendService.nextSong();
      };

      $scope.stopAudio = function() {
        audio.pause();
        $scope.setStreamUrl("");
      };

      audio.addEventListener('ended', function () {
        $scope.nextSong();
      });

      audio.addEventListener('error', function (error) {
        console.log('Audio Tag error event');
        $scope.nextSong();
      });
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
      var listenedEvents = [];

      $scope.search = function(query) {
        SearchService.search(query, SearchService.rdio);
      };

      $scope.requestSong = function (song) {
        console.log(song);
        BackendService.addSong(song.stream_url, song.title, song.description, song.user.username, song.artwork_url);
        $window.history.back();
      };

      listenedEvents.push(
        $rootScope.$on(SEARCH_EVENTS.searchSuccess, function (event, tracks, source) {
          console.log("RESULTS SUCCESS");
          var songs = [];

          if (source === SearchService.rdio) {
            for (var i = 0; i < tracks.length; i++) {
              if (tracks[i].canStream) {
                songs.push({
                  title   : track[i].name,
                  artist  : track[i].artist,
                  
                });
              }
            };

          } else {

          }
          console.log(tracks);
          $scope.results = tracks;
        })
      );

      $scope.$on('$destroy', function() {
        // each is a function to unregister
        for (event in listenedEvents) {
          listenedEvents[event]();
        }
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
      var listenedEvents = [];

      //init
      console.log('QUEUE SERVICE VARS');
      console.log(QueueService.queue);
      console.log(QueueService.nowPlaying);

      listenedEvents.push(
        $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event, queue, nowPlaying) {
          console.log('queue init');
          $scope.queue = queue;
          $scope.nowPlaying = nowPlaying;
        })
      );

      //update
      listenedEvents.push(
        $rootScope.$on(PARTY_EVENTS.partyQueueUpdate, function (event, queue, nowPlaying) {
          console.log('update event in party ctrl');
          console.log(queue);
          $scope.queue = queue;
          $scope.nowPlaying = nowPlaying;
          console.log(nowPlaying);
          $scope.$apply();
        })
      );

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

      $scope.logout = function() {
        $scope.stopAudio();
        Session.destroy();
        $location.path('/');
      };
      
      $scope.$on('$destroy', function() {
        // each is a function to unregister
        for (event in listenedEvents) {
          listenedEvents[event]();
        }
      });
  }])

.controller('PlayerCtrl', ['$scope', '$rootScope', '$document', '$interval', '$sce', 'QueueService', 'BackendService', 'PARTY_EVENTS',
  function($scope, $rootScope, $document, $interval, $sce, QueueService, BackendService, PARTY_EVENTS) {

    var clientIdParam = '?client_id=11c11021d4d8721cf1970667907f45d6';
    var listenedEvents = [];


    $scope.playerControl = function () {
      if (!$scope.isPlaying) {
        audio.play();
        $scope.isPlaying = true;
        QueueService.isPlaying = true;
      } else {
        audio.pause();
        $scope.isPlaying = false;
        QueueService.isPlaying = false;
      }
    };

    var setPlayer = function () {
      if ($scope.song = QueueService.nowPlaying) {
        $scope.timeWidth = "0%";
        $scope.setStreamUrl($scope.song.url + clientIdParam);
        $scope.isPlaying = true;
        QueueService.isPlaying = true;
      }
    };

    $scope.isPlaying = QueueService.isPlaying;
    $scope.timeWidth = "0%";
    $scope.disableNext = true;
    $scope.song = QueueService.nowPlaying;
    var audio = $document[0].querySelector('#audio');

    listenedEvents.push(
      $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event) {
        setPlayer();
      })
    );

    listenedEvents.push(
      $rootScope.$on(PARTY_EVENTS.nowPlayingChanged, function (event, queue) {
        console.log('now playing changed event');
        setPlayer();  
      })
    );

    setPlayer();

    var timeupdateListener = audio.addEventListener('timeupdate', function (event) {
      $scope.timeWidth = parseInt(audio.currentTime * 100 / audio.duration) + "%";
      $scope.$apply();
    });

    $scope.$on('$destroy', function() {
      // each is a function to unregister
      for (event in listenedEvents) {
        listenedEvents[event]();
      }

      audio.removeEventListener('timeupdateListener');
    });

}]);

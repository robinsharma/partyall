'use strict';

/* Controllers */

angular.module('partyAll.controllers', [])
  .controller('MainAppCtrl', ['$scope', '$rootScope','$sce', '$location', '$document', '$window', 'QueueService', 'BackendService', 'PARTY_EVENTS','USER_TYPES', 'AuthService', 'Session',
    function($scope, $rootScope, $sce, $location, $document, $window, QueueService, BackendService, PARTY_EVENTS, USER_TYPES, AuthService, Session) {
      $scope.currentUserData = null;
      //following two are for providing easy access to USER_TYPES and isAuthorized
      $scope.userTypes = USER_TYPES;
      $scope.isAuthorized = AuthService.isAuthorized;
      $scope.audio = $document[0].querySelector('#audio');

      $scope.setCurrentUserData = function (user) {
        $scope.currentUserData = user;
      };
      $scope.streamUrl = null;

      $scope.setStreamUrl = function(url) {
        $scope.streamUrl = $sce.trustAsResourceUrl(url);
      };

      $scope.disableNextSong = false;
      $scope.nextSong = function() {
        $scope.disableNextSong = true;
        BackendService.nextSong(function (error) {
          $scope.disableNextSong = false;
        });
      };

      $scope.stopAudio = function() {
        $scope.audio.pause();
        $scope.setStreamUrl("");
      };

      $scope.logout = function() {
        $scope.stopAudio();
        QueueService.destroy();
        Session.destroy();
        $location.path('/');
      };

      $rootScope.$on(PARTY_EVENTS.hostChanged, function (event) {
        $window.alert("We signed you out because you logged into a different device.");
        $scope.logout();
        $scope.$apply();
      });

      $scope.audio.addEventListener('ended', function () {
        $scope.setStreamUrl("");
        $scope.nextSong();
      });

      $scope.audio.addEventListener('error', function (error) {
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

      $scope.formError = false;
      $scope.errorMessage = "";
      $scope.disableForm = false;

      $scope.createParty = function(formData) {
        $scope.formError = false;
        $scope.errorMessage = "";
        $scope.disableForm = true;

        BackendService.createParty(formData, function (response) {
          $scope.disableForm = false;

          if (response.success) {
            $location.path('/party/' + response.partyKey + '/success');
          } else {
            $scope.formError = true;
            $scope.errorMessage = response.error;
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

      $scope.formError = false;
      $scope.errorMessage = "";
      $scope.disableForm = false;

      $scope.login = function(credentials) {
        $scope.formError = false;
        $scope.errorMessage = "";
        $scope.disableForm = true;

        BackendService.hostLogin(credentials, function (response) {
          $scope.disableForm = false;

          if (response.success) {
            $location.path('/party/'+response.partyKey);
          } else {
            $scope.formError = true;
            $scope.errorMessage = response.error;
          }
        });
      };
  }])

  .controller('GuestLoginCtrl', ['$scope', '$location', 'BackendService',
    function($scope, $location, BackendService) {
      $scope.credentials = {
        partyKey: ''
      };

      $scope.formError = false;
      $scope.errorMessage = "";
      $scope.disableForm = false;

      $scope.login = function(credentials) {
        $scope.formError = false;
        $scope.errorMessage = "";
        $scope.disableForm = true;

        BackendService.guestLogin(credentials, function (response) {
          $scope.disableForm = false;

          if (response.success) {
            $location.path('/party/'+response.partyKey);
          } else {
            $scope.formError = true;
            $scope.errorMessage = response.error;
          }
        });
      };
  }])

  .controller('CreateSuccessCtrl', ['$scope', 'Session',
    function($scope, Session) {
      $scope.partyName = Session.partyName;
      $scope.partyKey = Session.partyKey;
  }])

  .controller('SearchCtrl', ['$scope', '$rootScope', '$window', 'BackendService', 'Session', 'SearchService', 'SEARCH_EVENTS',
    function($scope, $rootScope, $window, BackendService, Session, SearchService, SEARCH_EVENTS) {
      $scope.query = "";
      $scope.isHost = Session.isHost();
      $scope.partyKey = Session.partyKey;
      $scope.partyName = Session.partyName;
      $scope.results = null;
      $scope.disableSearchForm = false;
      $scope.searchError = false;
      $scope.searchErrorMessage = "";

      var listenedEvents = [];

      $scope.search = function(query) {
        $scope.disableSearchForm = true;

        SearchService.search(query, function (errors) {
          $scope.disableSearchForm = false;
          $scope.searchError = true;
          $scope.searchErrorMessage = "Uh oh! There was an issue reaching SoundCloud - please try again.";
        });
      };

      $scope.requestSong = function (song, index) {
        $scope.results[index].disabled = true;
        BackendService.addSong(song.stream_url, song.title, song.description, song.user.username, song.artwork_url, song.permalink_url, function (error) {
          if (error) {
            $scope.results[index].disabled = false;
            $scope.searchError = true;
            $scope.searchErrorMessage = "Uh oh! There was an issue adding the song - please try again.";
          } else {
            $window.history.back();
          }
        });
      };

      $scope.navBack = function() {
        $window.history.back();
      };

      listenedEvents.push(
        $rootScope.$on(SEARCH_EVENTS.searchSuccess, function (event, tracks) {
          $scope.searchFormError = false;
          $scope.searchFormErrorMessage = "";
          $scope.results = tracks;
          $scope.disableSearchForm = false;
        })
      );

      $scope.$on('$destroy', function() {
        // each is a function to unregister
        for (event in listenedEvents) {
          listenedEvents[event]();
        }
      });

  }])

  .controller('PartyCtrl', ['$scope', '$rootScope', '$location', '$window','QueueService', 'Session', 'PARTY_EVENTS', 'BackendService',
    function($scope, $rootScope, $location, $window, QueueService, Session, PARTY_EVENTS, BackendService){
      $scope.partyName = Session.partyName;
      $scope.partyKey  = Session.partyKey;
      $scope.queue = QueueService.queue;
      $scope.nowPlaying = QueueService.nowPlaying;
      $scope.staticSongs = null;
      $scope.isHost = Session.isHost();
      $scope.disableNextSong = !QueueService.queue || !(QueueService.queue.length > 0);
      var listenedEvents = [];

      QueueService.init();

      listenedEvents.push(
        $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event, queue, nowPlaying) {
          $scope.queue = queue;
          $scope.nowPlaying = nowPlaying;
          $scope.disableNextSong = !QueueService.queue || !(QueueService.queue.length > 0);
        })
      );

      //update
      listenedEvents.push(
        $rootScope.$on(PARTY_EVENTS.partyQueueUpdate, function (event, queue, nowPlaying) {
          $scope.queue = queue;
          $scope.nowPlaying = nowPlaying;
          $scope.disableNextSong = !QueueService.queue || !(QueueService.queue.length > 0);
        })
      );

      $scope.addSong = function(song) {
        BackendService.addSong(song.url, song.title, song.description, song.artist, song.artwork);
      };

      $scope.toggleVote = function(song, index) {
        $scope.queue[index].disabled = true;
        BackendService.vote(song.id, function (error) {
          $scope.queue[index].disabled = false;
        });
      };

      $scope.navToSearch = function() {
        $location.path('/party/'+Session.partyKey+'/search');
      };

      $scope.navToSoundcloud = function(song) {
        $window.open(song.source, '_blank');
      };

      $scope.hasVote = function(song) {
        if (song.voters.indexOf(Session.userId) > -1) {
          return true;
        } else {
          return false;
        }
      };

      $scope.playNow = function(song, index) {
        $scope.queue[index].disabled = true;
        BackendService.playNow(song.id, function (error) {
          $scope.queue[index].disabled = false;
        });
      };

      $scope.showPartyKey = function () {
        $window.alert('Your Party Key is: ' + $scope.partyKey);
      }
      
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
        $scope.audio.play();
        $scope.isPlaying = true;
      } else {
        $scope.audio.pause();
        $scope.isPlaying = false;
      }
    };

    var setPlayer = function () {
      if ($scope.song = QueueService.nowPlaying) {
        $scope.timeWidth = "0%";
        $scope.setStreamUrl($scope.song.url + clientIdParam);
        $scope.isPlaying = QueueService.isPlaying;
      }
    };

    $scope.isPlaying = QueueService.isPlaying;
    $scope.timeWidth = "0%";
    $scope.currentTime = $scope.audio.currentTime ? formatTime($scope.audio.currentTime) : "-";
    $scope.duration = $scope.audio.duration ? formatTime($scope.audio.duration) : "-";
    $scope.song = QueueService.nowPlaying;
    // See w3 schools for readyState refernece: http://www.w3schools.com/tags/av_prop_readystate.asp
    $scope.loading = ($scope.audio.readyState !== 4) ? true : false;

    listenedEvents.push(
      $rootScope.$on(PARTY_EVENTS.partyQueueInit, function (event) {
        if (QueueService.nowPlaying) QueueService.isPlaying = true;
        setPlayer();
      })
    );

    listenedEvents.push(
      $rootScope.$on(PARTY_EVENTS.nowPlayingChanged, function (event, queue) {
        if (QueueService.nowPlaying) QueueService.isPlaying = true;
        setPlayer();  
      })
    );

    setPlayer();

    var timeupdateListener = $scope.audio.addEventListener('timeupdate', function (event) {
      $scope.timeWidth = parseInt($scope.audio.currentTime * 100 / $scope.audio.duration) + "%";
      $scope.currentTime = formatTime($scope.audio.currentTime);
      $scope.$apply();
    });

    var durationchangeListener = $scope.audio.addEventListener('durationchange', function (event) {
      $scope.timeWidth = parseInt($scope.audio.currentTime * 100 / $scope.audio.duration) + "%";
      $scope.duration = formatTime($scope.audio.duration);
      $scope.$apply();
    });

    var waitingListener = $scope.audio.addEventListener('waiting', function (event) {
      $scope.loading = true;
      $scope.$apply();
    });

    var stalledListener = $scope.audio.addEventListener('stalled', function (event) {
      $scope.loading = true;
      $scope.$apply();
    });

    var playingListener = $scope.audio.addEventListener('playing', function (event) {
      $scope.loading = false;
      $scope.$apply();
    });

    function formatTime(time) {
      var hours = parseInt( time / 3600 ) % 24;
      var minutes = parseInt( time / 60 ) % 60;
      var seconds = parseInt(time % 60, 10);
      return (hours > 0 ? hours+":" : "") + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    };

    $scope.$on('$destroy', function() {
      // each is a function to unregister
      for (event in listenedEvents) {
        listenedEvents[event]();
      }

      $scope.audio.removeEventListener('timeupdateListener');
      $scope.audio.removeEventListener('durationchangeListener');
      $scope.audio.removeEventListener('waitingListener');
      $scope.audio.removeEventListener('playingListener');
      $scope.audio.removeEventListener('stalledListener');

      QueueService.isPlaying = $scope.isPlaying;
    });

}]);

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

  .controller('HostLoginCtrl', ['$scope', '$rootScope', 
    function($scope, $rootScope) {

  }])  

  .controller('CreatePartyCtrl', ['$scope', '$rootScope', '$location', 'PARTY_EVENTS', 'PartyService',
    function($scope, $rootScope, $location, PARTY_EVENTS, PartyService) {
      $scope.credentials = {
        partyName: '',
        password: '',
        confirmedPassword: ''
      };
      //TODO validate passwords, provide visual feedback
      
      $rootScope.$on(PARTY_EVENTS.partyCreateSuccess, function (event) { //this is how we will listen for certain events
        $location.path('/create/success');
      });

      $rootScope.$on(PARTY_EVENTS.partyCreateFailure, function (event) {
        console.log("Party create fail event");
        // to-do handle failure
      });

      $scope.createParty = function(credentials) {
        console.log(credentials);
        PartyService.create(credentials);
      };

  }])

  .controller('GuestLoginCtrl', ['$scope', 
    function($scope) {

  }])

  .controller('CreateSuccessCtrl', ['$scope', 'PartyService',
    function($scope, PartyService) {
      $scope.party = PartyService.party;
  }])

  .controller('PartyCtrl', ['$scope', 'PartyService', 'Session', 'USER_TYPES',
    function($scope, PartyService, Session, USER_TYPES){
      $scope.party = PartyService.party;
      $scope.user = { type: Session.userType, id: Session.userId };

      
      $scope.isHost = function() {
        // return true;
        return Session.userType === USER_TYPES.host;
      };

      $scope.songPlaying = function() {
        return true;
        // return $scope.party.now_playing;
      };
      
  }])

.controller('PlayerCtrl', ['$scope', '$http', '$document', '$interval', 
  function($scope, $http, $document, $interval) {
    var soundcloudBaseUrl = 'http://api.soundcloud.com',
        soundcloudClientIdParam = '?client_id=11c11021d4d8721cf1970667907f45d6';

    var getPlaylist = function(callback) {
      $http
      .get(soundcloudBaseUrl + '/tracks' + soundcloudClientIdParam + '&q=problem')
      .success(function (tracks) {
        console.log(tracks);
        queue = tracks;
        callback();
      });

    };

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
      $interval.cancel(timer);
      currentSongIdx++;
      setPlayer();
      audio.play();
      $scope.isPlaying = true;
      timer = $interval(updateTime, 1000);
    };

    var setPlayer = function () {
      $scope.timeWidth = "0%";
      $scope.artwork = queue[currentSongIdx].artwork_url;
      $scope.title = queue[currentSongIdx].title;
      $scope.artist = queue[currentSongIdx].user.username;
      audio.src = queue[currentSongIdx].stream_url + '?client_id=11c11021d4d8721cf1970667907f45d6';
    };

    var updateTime = function() {
      $scope.timeWidth = parseInt(audio.currentTime * 100 / audio.duration) + "%";
    };

    $scope.artwork = null;
    $scope.title = null;
    $scope.artist = null;
    $scope.isPlaying = false;
    $scope.timeWidth = null;
    var currentSongIdx = 0;
    var queue = [];
    var song = {};
    var audio = $document[0].querySelector('#player');
    var timer;

    //init
    getPlaylist(function() {
      $scope.playerControl();
    });

    audio.addEventListener('ended', function () {
      $scope.$apply($scope.nextSong());
    });

}]);

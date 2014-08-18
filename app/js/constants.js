'use strict';

/* Constants */

angular.module('partyAll.constants', [])
  .constant('AUTH_EVENTS', {
    hostLoginSuccess: 'host-login-success',
    hostLoginFailed: 'host-login-failed',
    guestLoginSuccess: 'guest-login-success',
    guestLoginFailed: 'guest-login-failed'
  })

  .constant('PARTY_EVENTS', {
    partyCreateSuccess: 'party-create-success',
    partyCreateFailure: 'party-create-failure',
    partyQueueUpdate:   'party-queue-update',
    partyQueueInit:   'party-queue-init',
    staticSongs: 'static-songs',
    nowPlayingChanged: 'nowplaying-changed',
    hostChanged: 'host-changed'
  })

  .constant('SEARCH_EVENTS', {
    searchSuccess: 'search-success'
  })

  .constant('USER_TYPES', {
    host: 'host',
    guest: 'guest'
  });

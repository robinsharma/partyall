'use strict';

/* Constants */

angular.module('partyAll.constants', [])
  .constant('AUTH_EVENTS', {
    hostLoginSuccess: 'host-login-success',
    hostLoginFailed: 'host-login-failed',
    guestLoginSuccess: 'guest-login-success',
    guestLoginFailed: 'guest-login-failed'
  })

  .constant('USER_TYPES', {
    host: 'host',
    guest: 'guest'
  });

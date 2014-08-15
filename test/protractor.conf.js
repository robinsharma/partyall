'use strict';
/**
 * This file contains the configuration for Protractor's End-to-end testing.
 * 
 * @author Matthew Rodusek
 */
exports.config = {
	// Set time out
	allScriptsTimeout: 11000,

	// The specs to run
	specs: [
	        //'e2e/*.js'
	        'e2e/home.spec.js',
	        'e2e/login-host.spec.js',
	        'e2e/create-success.spec.js',
	        'e2e/login-guest.spec.js',
	        'e2e/party.spec.js',
	        'e2e/search.spec.js',
	],

	multiCapabilities: [{
		browserName: 'chrome'
	}, {
		browserName: 'firefox'
	}],
	// Safari seems to throw errors in general, and Opera can't be 
	// tested because it doesn't support Asynchronous java testing.
	
	onPrepare: function(){
		global.party = {
			name: '',
			key: '',
			password: ''
		};
	},
	onComplete: function(){
		console.log(party);
	},
	
	// Base URL to start with
	baseUrl: 'http://localhost:5000',

	// Display colors in the output log
	colors: true,

	// Using the Jasmine framework
	framework: 'jasmine',

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000
	}
};

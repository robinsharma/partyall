'use strict';
/**
 * Testing for the host login portion of the application
 * 
 * @author Matthew Rodusek
 */
describe("PartyAll Host Login Page", function () {
	var models = { create: {}, signin: {} };
	
	/* CONFIGURABLE SECTION STARTS             */
	
	// Expected title of the Host login page
	var title = 'PartyAll';
	
	// Party information
	party.name     = "Bob's Kegger";
	party.password = "password";

	// Create form models
	models.create.name     = 'formData.partyName';
	models.create.password = 'formData.password';
	models.create.confirm  = 'formData.confirmedPassword';
	models.create.submit   = ''; // Button not (presently) given an ng-model
	
	// Sign-in form models
	models.signin.key      = 'credentials.partyKey';
	models.signin.password = 'credentials.password';
	models.signin.submit   = ''; // Button not (presently) given an ng-model

	/* CONFIGURABLE SECTION ENDS               */
	
	/* Functions
	----------------------------------------------------------------------- */
		
	/**
	 * Fills the create party form with the specified information,
	 * returning the element for the submit button
	 */
	function fillCreateForm( party, password, confirm ){
		var inputPartyName = element( by.model( models.create.name ) );
		var inputPassword  = element( by.model( models.create.password ) );
		var inputConfirm   = element( by.model( models.create.confirm ) );
		var buttonSubmit   = element( by.css( '.btn-primary' ) );
		// Mock fake login
		inputPartyName.sendKeys( party );
		inputPassword.sendKeys( password );
		inputConfirm.sendKeys( confirm );
		
		return buttonSubmit;
	}
	
	/**
	 * fills the join party form with the specified information,
	 * returning the element for the submit button
	 */
	function fillJoinForm( key,password ){
		var inputPartyKey = element( by.model( models.signin.key ) );
		var inputPassword = element( by.model( models.signin.password ) );
		var buttonSubmit  = element( by.css( '.btn-default' ) );
		
		inputPartyKey.sendKeys(key);
		inputPassword.sendKeys(password);
		
		return buttonSubmit;
	}
	
	/* Testing
	----------------------------------------------------------------------- */
	
	//var partyKey;
	
	// -----------------------------------------------------------------
	// Redirect to the host login page before each test
	// -----------------------------------------------------------------
	beforeEach(function() {
		browser.get( '/#/login/host' );
	});

	// -----------------------------------------------------------------
	// Make sure the title is correct
	//
	// expects: title to be accurate
	// -----------------------------------------------------------------
	it("should display the correct title", function () {
		expect(browser.getTitle()).toBe( title );
	});
	
	// -----------------------------------------------------------------
	// Test failing the creation of a party
	//
	// expects: not to be redirected to /create/success
	// -----------------------------------------------------------------
	it('Should fail creating party', function(){
		var confirm = party.password.substring( 1 );
		var buttonSubmit = fillCreateForm( party.name, party.password, confirm );
		var currentUrl;
		
		buttonSubmit.click()
		browser.waitForAngular();
		
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect(currentUrl).not.toContain( '#/create/success' );
		});
	});
	
	// -----------------------------------------------------------------
	// Test failing to join a non-existant party
	//
	// expects: not to be redirected to /party
	// -----------------------------------------------------------------
	it('Should fail joining as host', function(){
		var buttonSubmit = fillJoinForm('qwerty','password');
		var currentUrl;
		buttonSubmit.click();
		browser.waitForAngular();
		
		// Expect to be redirected to create/success
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect(currentUrl).not.toContain( '#/party' );
		});
	});
	
	// -----------------------------------------------------------------
	// Testing succeeding in creating a party 
	//
	// expects: to be redirected to /create/success
	// -----------------------------------------------------------------
	it('Should succeed creating party', function(){
		var buttonSubmit = fillCreateForm( party.name, party.password, party.password );
		var keyElement;
		var currentUrl;
		buttonSubmit.click()
		browser.waitForAngular();
		
		// Expect to be redirected to create/success
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect( currentUrl ).toContain( '#/create/success' );
			element( by.binding( 'partyKey' ) ).getText().then( function( data ){
				party.key = data;
			})
		});
	});
	
	// -----------------------------------------------------------------
	// Testing to see if it can succeed joining as host
	//
	// expects: to be redirected to /party/{partyKey}
	// -----------------------------------------------------------------
	it('Should succeed joining as host', function(){
		var buttonSubmit = fillJoinForm( party.key, "password" );
		var currentUrl;
		buttonSubmit.click()
		browser.waitForAngular();
				
		// Expect to not be on the login page anymore
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect(currentUrl).toContain( '#/party/' );
		});
	});	
});
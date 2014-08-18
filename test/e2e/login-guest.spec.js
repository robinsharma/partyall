'use strict';
/**
 * Testing for the guest login portion of the application
 * 
 * @author Matthew Rodusek
 */
describe("PartyAll Guest Login", function () {
	var models = { login: {} };
	
	/* CONFIGURABLE SECTION STARTS             */
	
	// Expected title of the Guest login page
	var title = 'PartyAll';

	models.login.key    = 'credentials.partyKey';
	models.login.submit = ''; // Button not (presently) given an ng-model
	
	/* CONFIGURABLE SECTION ENDS               */
	
	/* Testing
	----------------------------------------------------------------------- */
	
	// -----------------------------------------------------------------
	// Redirect to the host login page before each test
	// -----------------------------------------------------------------
	beforeEach(function() {
		browser.get( '/#/login/guest' );
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
	// Should fail logging into the Party
	//
	// expects: not to be redirected to /party/{partykey}
	// -----------------------------------------------------------------
	it('Should fail joining party', function(){
		var inputPartyKey = element(by.model( models.login.key ));
		var buttonSubmit  = element(by.css( '.btn-primary' ));
		var currentUrl;
		
		inputPartyKey.sendKeys( 'qwerty' );
		buttonSubmit.click()
		
		browser.waitForAngular();
		
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect(currentUrl).not.toContain( '#/party' );
		});

	});
	
	// -----------------------------------------------------------------
	// Should succeed logging into the Party
	//
	// expects: to be redirected to /party/{partykey}
	// -----------------------------------------------------------------
	it('Should succeed joining party', function(){
		var inputPartyKey = element(by.model( models.login.key ));
		var buttonSubmit  = element(by.css( '.btn-primary' ));
		var currentUrl;
		
		inputPartyKey.sendKeys( party.key );
		buttonSubmit.click()
		
		browser.waitForAngular();
		
		browser.getCurrentUrl().then(function(url){
			currentUrl = url;
		}).then(function(){
			expect(currentUrl).toContain( '#/party' );
		});
		
	});

});
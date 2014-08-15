'use strict';
/**
 * Testing the Party Success page
 * 
 * @author Matthew Rodusek
 */
describe("Create Party Success", function () {
	
	/* CONFIGURABLE SECTION STARTS             */
	
	// Expected title of the Host login page
	var title = 'PartyAll';

	/* CONFIGURABLE SECTION ENDS               */
	
	/* Testing
	----------------------------------------------------------------------- */
	
	// -----------------------------------------------------------------
	// Party Success creation page should redirect home, not be directly
	// accessible.
	//
	// expects: to fail being directed to /create/success
	// -----------------------------------------------------------------	
	it("Should redirect to homepage", function(){
		var currentUrl;
		
		browser.get( '/#/create/success' );
		browser.waitForAngular();

		browser.getCurrentUrl().then( function( url ){
			currentUrl = url;
		}).then(function(){
			expect( currentUrl ).not.toContain( '#/create/success' );
		});
	});
});
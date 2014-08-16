'use strict';
/**
 * Testing for the home page of this application
 * 
 * @author Matthew Rodusek
 */
describe("PartyAll Home Page", function () {
	
	/* CONFIGURABLE SECTION STARTS             */
	
	// Expected title of the Host login page
	var title = 'PartyAll';

	/* CONFIGURABLE SECTION ENDS               */
	
	/* Testing
	----------------------------------------------------------------------- */

	// -----------------------------------------------------------------
	// Check the home page title for accuracy
	//
	// expects: title to be correct
	// -----------------------------------------------------------------
	it("should display the correct title", function () {
		browser.get('/#');
		expect(browser.getTitle()).toBe( title );
	});	
});
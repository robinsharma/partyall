'use strict';
/**
 * Testing the Party page
 * 
 * @author Matthew Rodusek
 */
describe("PartyAll Party", function () {
	var models = { song: {} };
	var values = {};
	
	/* CONFIGURABLE SECTION STARTS             */
	
	// Expected title of the Party page
	values.title = 'PartyAll | ' + party.name;
	values.uri   = '/#/party/' + party.key;
	
	
	/* CONFIGURABLE SECTION ENDS               */
	
	/* Testing
	----------------------------------------------------------------------- */
	
	// -----------------------------------------------------------------
	// Redirect to the Party page before each test
	// -----------------------------------------------------------------
	beforeEach(function() {
		browser.get( '/#/party/' + party.key );
	});
	
	// -----------------------------------------------------------------
	// Make sure the title is correct
	//
	// expects: title to be accurate
	// -----------------------------------------------------------------
	it("should display the correct title", function () {
		expect( browser.getTitle() ).toBe( values.title );
	});
	
	// -----------------------------------------------------------------
	// Testing to see if the party name is correct
	//
	// expects: party name to equal the entered party name
	// -----------------------------------------------------------------
	it("should display the party name", function(){
		var title = element( by.binding( 'party.name' ) );
		
		expect( title.getText() ).toBe( party.name );
	});
	
});
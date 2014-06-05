App.controller('host-login', function ($page) {
    var $submitButton = $page.querySelector('.app-button.green.submit');
    $submitButton.addEventListener('click', function () {
        //TODO VERIFY
        App.load('party', PARTY_ID);
    });
});

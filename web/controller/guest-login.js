App.controller('guest-login', function ($page) {
    var $submitButton = $page.querySelector('.app-button.green.submit');
    $submitButton.addEventListener('click', function () {
        //TODO VERIFY
        var data = { party_id : '1234', session_token : '1234'}
        App.load('party', data);
    });
});

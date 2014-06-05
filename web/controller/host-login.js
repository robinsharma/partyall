App.controller('host-login', function ($page) {
    var $submitButton = $page.querySelector('.app-button.green.submit');
    $submitButton.addEventListener('click', function () {
        //TODO VERIFY and get back party_id + host session token
        var data = { party_id : '1234', session_token : '123456'}
        App.load('party', data);
    });
});

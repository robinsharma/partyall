App.controller('home', function ($page) {
    var $hostButton  = $page.querySelector('.half-circle.host-button'),
        $guestButton = $page.querySelector('.half-circle.guest-button');

    $hostButton.addEventListener('click', function () {
        App.load('host-login');
    });
    $guestButton.addEventListener('click', function () {
        App.load('guest-login');
    });
});

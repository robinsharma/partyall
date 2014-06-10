App.controller('party', function ($page, data) {
    //TODO verify incoming page data
    //TODO check token to detemine user type
    //TODO grab party data from server
    //TODO render UI
    //TODO spinners!!!
    //EVENT LISTENERS FOR NEW DATA! :)
    if (!data || !data.party_id || !data.session_token) {
        unauthorizedDialog();
        return;
    }
    var userType = verifySessionToken(data.session_token);
    console.log(userType);
    
    var $songTmpl    = $page.querySelector('.song');
        $songSection = $songTmpl.parentNode;

    $songTmpl.parentNode.removeChild($songTmpl);

    //TODO get party data
    var data = partyData;
    var votedSongs = []; //TODO grab from local storage etc.
    renderPageTitle(data.party_name);

    var rank = 1;
    data.queue.sort(function (song1, song2) {
        return (song2.votes-song1.votes);
    }).forEach( function (song) {
        var $song = $songTmpl.cloneNode(true);
        renderRank($song, rank);
        renderThumbnail($song, song);
        renderIcon($song, song);
        renderText($song, song);
        renderId($song, song);

        Clickable($song);
        $song.addEventListener('click', function () {
            //TODO make api call to render favourite or play event
            if (userType === 'host') {
                App.dialog({
                    title         : 'Upvote or Play Now?',
                    text          : 'Would you like to upvote this song or play it now?',
                    upVoteButton  : 'Upvote',
                    playNowButton : 'Play',
                    cancelButton  : 'Cancel'
                }, function (choice) {
                    var img = 'url(/img/vote.png)';
                    if (!choice) {
                        return;
                    }
                    switch (choice) {
                        case 'upVote':
                            if (checkVote(song)) {
                                img = 'url(/img/un-vote.png)';
                            }
                            break;
                        case 'playNow':
                            img = 'url(/img/play.png)';

                    }
                    $page.querySelector('#'+song.song_id).querySelector('.icon')
                        .style['background-image'] = img;
                });
            } else {
                var img = 'url(/img/vote.png)';
                if (checkVote(song)) {
                    img = 'url(/img/un-vote.png)';
                }
                $page.querySelector('#'+song.song_id).querySelector('.icon')
                    .style['background-image'] = img;
            }
        })

        $songSection.appendChild($song);
        rank += 1;
    });

    function verifySessionToken(token) {
        //TODO make API call to check token
        if (!sessionData[token]) {
            console.log(sessionData)
            unauthorizedDialog();
            return;
        }
        return sessionData[token];

    }

    function checkVote(song) {
        //TODO check vote
        var index = votedSongs.indexOf(song.song_id);
        console.log(votedSongs);
        if (index !== -1) {
            votedSongs.splice(index, 1);
            return true;
        } else {
            votedSongs.push(song.song_id);
            return false;
        }
    }

    function renderPageTitle(title) {
        $page.querySelector('.app-title').textContent = title;
    }

    function renderRank($element, rank) {
        $element.querySelector('.rank').textContent = rank;
    }
    function renderThumbnail($element, song) {
        $element.querySelector('.thumbnail')
            .style['background-image'] = 'url(' + song.thumbnail + ')';
    }
    function renderIcon($element, song) {
        if (song.status === 'queued') {
            //TODO check favourites

        } else if (song.status === 'playing') {
            $element.querySelector('.icon')
                .style['background-image'] = 'url(/img/play.png)';
        } else {
            //TODO
        }
    }
    function renderText($element, song) {
        $element.querySelector('.text .title')
            .textContent = song.title + ' - ' + song.artist;
        $element.querySelector('.text .description')
            .textContent = 'Votes: ' + song.votes;
    }
    function renderId($element, song) {
        $element.setAttribute('id', song.song_id);
    }

    function unauthorizedDialog() {
        App.dialog({
            title        : 'Unauthorized Access',
            text         : 'How did you get here?!',
            okButton     : 'Ok',
        }, function () {
            App.load('home');
        });
    }
});

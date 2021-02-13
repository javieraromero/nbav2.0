let params = (new URL(document.location)).searchParams;
let date = params.get('date');
let gameId = params.get('gameId');

fetch(`http://data.nba.net/prod/v1/${ date }/${ gameId }_boxscore.json`)
    .then(res => res.json())
    .then(data => {
        const bgd = data.basicGameData;
        let gameTitleCard = document.createElement('h1');
        gameTitleCard.innerText = `${ bgd.vTeam.triCode } ${ bgd.vTeam.score }`
                + `\n${ bgd.hTeam.triCode } ${ bgd.hTeam.score }`;
            
            document.body.append(gameTitleCard);
    });
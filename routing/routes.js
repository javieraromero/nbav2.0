const routeFunctions = require('./routeFunctions');
const fetch = require('node-fetch');

module.exports = app => {
    app.get('/', (req, res) => {
        let date = routeFunctions.getDate();
        res.redirect(`/${date}`);
    });
    
    app.get('/:date', (req, res) => {
        let { date } = req.params;
        fetch(`http://data.nba.net/10s/prod/v1/${ date }/scoreboard.json`)
            .then(res => res.json())
            .then(data => {
                res.render('date', {...data})
            });
    });

    app.get('/:date/:gameId', (req, res) => {
        let { date, gameId } = req.params;
        fetch(`http://data.nba.net/prod/v1/${ date }/${ gameId }_boxscore.json`)
            .then(res => res.json())
            .then(data => {
                res.render('game', {...data})
            });
    });
};
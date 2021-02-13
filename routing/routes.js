const routeFunctions = require('./routeFunctions');
const appRoot = require('app-root-path');

const pages = `${ appRoot }/pages/`;

module.exports = app => {
    app.get('/', (req, res) => {
        let date = routeFunctions.getDate();
        res.redirect(`/date?date=${ date }`);
    });

    app.get('/date', (req, res) => {
        res.render(`${ pages }date`);
    });

    app.get('/game', (req, res) => {
        res.render(`${ pages }game`);
    });
};
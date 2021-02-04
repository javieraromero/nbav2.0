const express = require('express');
const path = require('path');

const app = express();
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

require('./routing/routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
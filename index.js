const express = require('express');
//const path = require('path');

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('public'));

require('./routing/routes')(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is now listening on port ${PORT}`));
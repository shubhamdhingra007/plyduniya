const express = require('express');
const path = require("path");
const app = express()

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    console.log('/ hit on server')
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3003, () => console.log('Listening on port 3003!'))
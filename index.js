var parseDataSheet = require('./lib/parseDataSheet');
var express        = require('express');
var app            = express();

var eventsData = require('./data/eventsData');
var timelineData = require('./data/timelineData');
var tagsData = require('./data/tagsData');

var v = '1.0'

var options = {
    host: 'spreadsheets.google.com',
    port: 443,
    path: '/feeds/list/1enjDLyGzghZt2p27ZG3kaEt2bRxdGzpQ9bEvKmombr4/996901514/public/values?v=3.0&alt=json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

// parseDataSheet.getJSON(options, function (statusCode, result) {
//     console.log("result: " + statusCode);
//     console.log("data " + JSON.stringify(result));
// });

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

app.get('/api/' + v + '/events', function (req, res) {
    res.send(eventsData);
});

app.get('/api/' + v + '/timeline', function (req, res) {
    res.send(timelineData);
});

app.get('/api/' + v + '/tags', function (req, res) {
    res.send(tagsData);
});

var port = Number(process.env.PORT || 5000);
app.listen(port);

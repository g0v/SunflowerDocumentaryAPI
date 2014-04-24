var express        = require('express');
var app            = express();

var eventsData = require('./data/eventsData');
var timelineData = require('./data/timelineData');
var tagsData = require('./data/tagsData');

var v = '1.0';

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

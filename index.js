var express        = require('express');
var app            = express();

var db = require('./lib/transferJSON')

var eventsData = require('./data/eventsData');
var timelineData = require('./data/timelineData');
var tagsData = require('./data/tagsData');

var v = '1.0';
var beta = '1.0b';

db.init();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    next();
});

app.get('/api/' + v + '/events', function (req, res) {
    res.send(eventsData);
});

app.get('/api/' + beta + '/events', function (req, res) {
    res.send(db.getEventsData());
});

app.get('/api/' + v + '/timeline', function (req, res) {
    res.send(timelineData);
});

app.get('/api/' + beta + '/timeline', function (req, res) {
    res.send(db.getTimelineData());
});

app.get('/api/' + v + '/tags', function (req, res) {
    res.send(tagsData);
});

app.get('/api/' + beta + '/tags', function (req, res) {
    res.send(db.getTagsData());
});

var port = Number(process.env.PORT || 5000);
app.listen(port);

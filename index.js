var parseDataSheet = require('./lib/parseDataSheet');
var express        = require('express');
var app            = express();

var options = {
    host: 'spreadsheets.google.com',
    port: 443,
    path: '/feeds/list/1enjDLyGzghZt2p27ZG3kaEt2bRxdGzpQ9bEvKmombr4/996901514/public/values?v=3.0&alt=json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

parseDataSheet.getJSON(options, function (statusCode, result) {
    console.log("result: " + statusCode);
    console.log("data " + JSON.stringify(result));
})

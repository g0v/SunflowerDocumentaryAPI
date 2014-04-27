var dataSheetConfig = require('../data/dataSheetConfig');
var parseDataSheet  = require('../lib/parseDataSheet');

var options = {
    host: dataSheetConfig.host,
    port: 443,
    path: '/feeds/list/' + dataSheetConfig.sheetID + '/' + dataSheetConfig.listID[0] +'/public/values?v=3.0&alt=json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var eventsData = [];

exports.init = function () {

    for (var k = 0; k <dataSheetConfig.listID.length; k++) {
        options.path = '/feeds/list/' + dataSheetConfig.sheetID + '/' + dataSheetConfig.listID[k] +'/public/values?v=3.0&alt=json';

        parseDataSheet.getJSON(options, function (statusCode, result) {
            var timeTmp    = result.feed.title.$t;
            var eventPlace = getPlace(result.feed.entry[0].content.$t);
            var eventKey   = getEventKey(result.feed.entry[1].content.$t);

            for (var i = 3; i < result.feed.entry.length; i++) {
                var rowData = result.feed.entry[i];

                if (rowData.content.$t != '') {
                    var eventTime = getTime(timeTmp, rowData.title.$t);

                    for (var j = 0; j < eventPlace.length; j++) {
                        var keyTmp = 'gsx$' + eventPlace[j].key;
                        if (typeof(rowData[keyTmp]) != 'undefined') {
                            var eventTmp = rowData[keyTmp];

                            var eventEntry = {  event_id: 0,
                                                title: eventTmp.$t,
                                                description: '',
                                                site: '',
                                                thumbnail: '',
                                                media: '',
                                                tag: '',
                                                hackpad: '',
                                                date: eventTime
                                            };
                            eventsData.push(eventEntry);
                        }
                    }
                }
            }
        });
    }
};


getPlace = function (content) {
    var placeTmp  = content.split(', ');
    var placeTmp2 = [];
    placeTmp.forEach(function (value) {
        var placeEntry = {
            key: value.slice(0, 6),
            placeName: value.slice(8)
        };
        placeTmp2.push(placeEntry);
    });
    return placeTmp2;
}

getEventKey = function (content) {
    var keyTmp  = content.split(', ');
    var keyTmp2 = [];
    keyTmp.forEach(function (value) {
        var keyEntry = {
            key: value.slice(0,6),
            keyName: value.slice(8)
        };
        keyTmp2.push(keyEntry);
    });
    return keyTmp2;
}

getTime = function (timeTmp, timeTmp2) {
    var eventsTmp  = new Date(timeTmp + ' ' + timeTmp2);
    var eventsDate = {  full: eventsTmp.getFullYear() + '-' +
                              (eventsTmp.getMonth() + 1) + '-' +
                              eventsTmp.getDate() + 'T' +
                              eventsTmp.toLocaleTimeString() + '+08:00',
                        yyyy: eventsTmp.getFullYear(),
                        mm: eventsTmp.getMonth() + 1,
                        dd: eventsTmp.getDate(),
                        hh: eventsTmp.getHours(),
                        ii: eventsTmp.getMinutes(),
                        ss: eventsTmp.getMilliseconds()
                    };
    return eventsDate;
}

exports.getEvents = function () {
    return eventsData;
}

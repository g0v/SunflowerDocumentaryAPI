var dataSheetConfig = require('../data/dataSheetConfig');
var parseDataSheet  = require('../lib/parseDataSheet');
var hackpad         = require('hackpad');

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

    for (var k = 0; k < dataSheetConfig.listID.length; k++) {
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
                        var eventKeyTmp = eventPlace[j].key;
                        if (typeof(rowData['gsx$' + eventKeyTmp]) != 'undefined') {
                            var eventEntry = parseEvent(eventKeyTmp, eventKey, eventTime, eventPlace[j].placeName, rowData);
                            eventEntry['event_id'] = eventTime['full'].slice(0, 10).replace(/\-/g, '') +
                                                    ((i >= 10) ? i : ('0' + i)) +
                                                    ((j >= 10) ? j : ('0' + j));
                            eventsData.push(eventEntry);
                        }
                    }
                }
            }
        });
    }
    eventsData.sort(function (a, b) {
        return a.event_id - b.event_id;
    })
};

parseEvent = function (eventKeyTmp, eventKey, eventTime, placeName, rowData) {
    var eventKeyIndex = indexOfEventKey(eventKey, eventKeyTmp);
    var eventTmp      = rowData['gsx$' + eventKeyTmp].$t;
    var mediaTmp      = typeof(rowData['gsx$' + eventKey[eventKeyIndex+1].key]) == 'undefined' ? '' : rowData['gsx$' + eventKey[eventKeyIndex+1].key].$t;
    var hackpad_chTmp = typeof(rowData['gsx$' + eventKey[eventKeyIndex+2].key]) == 'undefined' ? '' : rowData['gsx$' + eventKey[eventKeyIndex+2].key].$t;
    var hackpad_enTmp = typeof(rowData['gsx$' + eventKey[eventKeyIndex+3].key]) == 'undefined' ? '' : rowData['gsx$' + eventKey[eventKeyIndex+3].key].$t;
    var tagTmp        = typeof(rowData['gsx$' + eventKey[eventKeyIndex+4].key]) == 'undefined' ? '' : rowData['gsx$' + eventKey[eventKeyIndex+4].key].$t;
    var photoTmp      = typeof(rowData['gsx$' + eventKey[eventKeyIndex+5].key]) == 'undefined' ? '' : rowData['gsx$' + eventKey[eventKeyIndex+5].key].$t;
    var placeTmp      = typeof(rowData['gsx$' + eventKey[eventKeyIndex+6].key]) != 'undefined' && eventKey[eventKeyIndex+6].keyName == 'place' ? rowData['gsx$' + eventKey[eventKeyIndex+6].key].$t : placeName;

    var eventEntry = {  event_id        : 0,
                        title           : eventTmp,
                        description_ch  : '',
                        description_en  : '',
                        site            : placeTmp,
                        thumbnail       : '',
                        media           : mediaTmp,
                        tag             : tagTmp.split(','),
                        hackpad_ch      : hackpad_chTmp,
                        hackpad_en      : hackpad_enTmp,
                        date            : eventTime
                    };
    return eventEntry;
}

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

indexOfEventKey = function (eventKeyArray ,key) {
    for (var i = 0; i < eventKeyArray.length; i++) {
        if (eventKeyArray[i].key == key) {
            return i;
        }
    }
    return -1;
}

getTime = function (timeTmp, timeTmp2) {
    var eventsTmp  = new Date(timeTmp + ' ' + timeTmp2);
    var eventsMonth = (eventsTmp.getMonth() + 1) >= 10 ? (eventsTmp.getMonth() + 1).toString() : '0' + (eventsTmp.getMonth() + 1);
    var eventsDate = {  full: eventsTmp.getFullYear() + '-' +
                              eventsMonth + '-' +
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

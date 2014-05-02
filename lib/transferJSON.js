var dataSheetConfig = require('../data/dataSheetConfig');
var parseDataSheet  = require('../lib/parseDataSheet');
var hackpad         = require('hackpad');

var hackpadOptions  = {
    clientID: process.env.HACKPADCLIENTID,
    secret: process.env.HACKPADSECRET,
    site: '318'
}
var hackpadClient = new hackpad(hackpadOptions.clientID, hackpadOptions.secret, hackpadOptions);

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
var timelineData = [];
var tagsData = [];

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
                            if (eventEntry['hackpad_ch'] != '') {
                                var padIDTmp = eventEntry['hackpad_ch'].slice(eventEntry['hackpad_ch'].length - 11);
                                getHackpadConetnt(padIDTmp, function (result) {
                                    eventEntry['description_ch'] = result;
                                });
                            }
                            if (eventEntry['hackpad_en'] != '') {
                                var padIDENTmp = eventEntry['hackpad_en'].slice(eventEntry['hackpad_en'].length - 11);
                                getHackpadConetnt(padIDENTmp, function (result) {
                                    eventEntry['description_en'] = result;
                                });
                            }
                            eventsData.push(eventEntry);
                            timelineData.push({
                                event_id: eventEntry.event_id,
                                focus   : eventEntry.tag.some( function (getTag) { return getTag.name == '重要事件'; }) ? 1 : 0,
                                title   : eventEntry.title,
                                date    : eventEntry.date
                            });
                        }
                    }
                }
            }
            eventsData.sort(function (a, b) {
                return a.event_id - b.event_id;
            });
            timelineData.sort(function (a, b) {
                return a.event_id - b.event_id;
            })
        });
    }
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
                        media           : mediaTmp.split(', '),
                        tag             : getTag(tagTmp),
                        hackpad_ch      : hackpad_chTmp,
                        hackpad_en      : hackpad_enTmp,
                        date            : eventTime
                    };
    return eventEntry;
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
};

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
};

getTag = function (content) {
    var tagTmp = content.split(',');
    var tagTmp2 = [];
    if (tagTmp.length > 1 || tagTmp[0] != '') {
        tagTmp.forEach(function (value) {
            var tagID = addTagData(content);
            var tagEntry = {
                id: tagID,
                name: value
            };
            tagTmp2.push(tagEntry);
        });
    }
    return tagTmp2;
};

addTagData = function (content) {
    var tagID = 0;
    tagsData.forEach(function (value) {
        if (value['name'] == content) {
            tagID = value['id'];
        }
    });
    if (tagID == 0) {
        tagID = tagsData.length + 1;
        tagsData.push({
            id: tagID,
            name: content
        });
    }
    return tagID;
}

indexOfEventKey = function (eventKeyArray ,key) {
    for (var i = 0; i < eventKeyArray.length; i++) {
        if (eventKeyArray[i].key == key) {
            return i;
        }
    }
    return -1;
};

getTime = function (timeTmp, timeTmp2) {
    var eventsTmp   = new Date(timeTmp + ' ' + timeTmp2);
    var eventsMonth = (eventsTmp.getMonth() + 1) >= 10 ? (eventsTmp.getMonth() + 1).toString() : '0' + (eventsTmp.getMonth() + 1);
    var eventsDate1 = eventsTmp.getDate() >= 10 ? eventsTmp.getDate().toString() : '0' + eventsTmp.getDate();
    var eventsDate  = {  full: eventsTmp.getFullYear() + '-' +
                              eventsMonth + '-' +
                              eventsDate1 + 'T' +
                              eventsTmp.toLocaleTimeString() + '+08:00',
                        yyyy: eventsTmp.getFullYear(),
                        mm: eventsTmp.getMonth() + 1,
                        dd: eventsTmp.getDate(),
                        hh: eventsTmp.getHours(),
                        ii: eventsTmp.getMinutes(),
                        ss: eventsTmp.getMilliseconds()
                    };
    return eventsDate;
};

getHackpadConetnt = function (padID, getResult) {
    hackpadClient.export(padID, 'latest', 'txt', function (err, result) {
        if (err) {
            console.log(err);
        } else {
            var content = result.slice(result.indexOf('內文') + 3);
            getResult(content);
        }
    })
};

exports.getEventsData = function () {
    return eventsData;
};

exports.getTagsData = function () {
    return tagsData;
}

exports.getTimelineData = function () {
    return timelineData;
}

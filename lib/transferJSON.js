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

parseDataSheet.getJSON(options, function (statusCode, result) {
    var timeTmp = result.feed.title.$t;
    for (var i = 3; i < result.feed.entry.length; i++) {
        var rowData = result.feed.entry[i];

        getTime(timeTmp, rowData.title.$t, function(time) {
            console.log(time);
        });
    }
});

getTime = function (timeTmp, timeTmp2, getResult) {
    var eventsTmp = new Date(timeTmp + ' ' + timeTmp2);
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
    getResult(eventsDate);
}

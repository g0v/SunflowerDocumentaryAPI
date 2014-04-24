var dataSheetConfig = require('../data/dataSheetConfig');
var parseDataSheet = require('../lib/parseDataSheet');

var options = {
    host: dataSheetConfig.host,
    port: 443,
    path: '/feeds/list/' + dataSheetConfig.sheetID + '/' + dataSheetConfig.listID[0] +'/public/values?v=3.0&alt=json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

parseDataSheet.getJSON(options, function (statusCode, result) {
    console.log("result: " + statusCode);
    console.log("data " + JSON.stringify(result));
});

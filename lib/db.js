
var app = module.exports = exports = {};

var eventsData   = [];
var timelineData = [];
var tagsData     = [];

app.init = function () {
    eventsData   = [];
    timelineData = [];
    tagsData     = [];
};

app.pushEventData = function (event) {
    eventsData.push(event);
    eventsData.sort(function (a, b) {
        return a.event_id - b.event_id;
    });
};

app.updateEventData = function (eventID, key, value) {
    eventsData.forEach(function (entry) {
        if (entry.event_id === eventID) {
            entry[key] = value;
        }
    })
};

app.getEventsData = function () {
    return eventsData;
};

app.pushTimelineData = function (data) {
    timelineData.push(data);
    timelineData.sort(function (a, b) {
        return a.event_id - b.event_id;
    });
};

app.getTimelineData = function () {
    return timelineData;
};

app.pushTagsData = function (content) {
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
};

app.getTagsData = function () {
    return tagsData;
}

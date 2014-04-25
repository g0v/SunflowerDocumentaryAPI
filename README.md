SunflowerDocumentaryAPI
=============

The Sunflower Documentary [Data API](http://sunflower-documentary-api.herokuapp.com/api/1.0/events).

## API Usage

- Get all events
`api/1.0/events`
- Get timeline
`api/1.0/timeline`
- Get all tags
`api/1.0/tags`

## Data format

- Timeline
```
[
    {
        "event_id": 1,
        "focus": 1,
        "title": "兩岸經貿如何影響民主？",
        "date": {
             "yyyy" : 2014, "mm" : 3, "dd" : 21,
             "hh" : 0, "ii" :0, "ss" : 0 }
    },
]
```

- Event
```
[
    {
        "event_id": 1,
        "title": "兩岸經貿如何影響民主？",
        "description": "逐字在此",
        "site": "濟南路",
        "thumbnail": ["img/event/1.jpg"],
        "media": [
        "https://www.youtube.com/watch?v=UKbOavrerNQ&t=53m37s",
        "https://www.youtube.com/watch?v=UKbOavrerNQ&t=53m36s"
        ],
        "tag": [
            { "id": 1, name": "街頭民主教室" },
            { "id": 2, name": "太陽花" },...
        ],
        "hackpad": "https://318.hackpad.com/--F0W0Fnhkakl",
        "date": {
             "yyyy" : 2014, "mm" : 3, "dd" : 21,
             "hh" : 0, "ii" :0, "ss" : 0 }
    }
]
```

- tag
```
[
    { "id" : 1, "name" : "街頭民主教室" },...
]
```

## Change Log

#### 2014/04/24
- Add `dataSheetConfig.js` to storage the configuration.
- init `transferJSON.js` that used to transfer DataSheetJSON to eventsJSON

#### 2014/04/22 
- Add Test Data

## Installation

`npm i`

`npm start`

and then open `http://localhost:5000/api/1.0/events`

## License

The MIT License (MIT)

Copyright (c) 2014 Lee  < jessy1092@gmail.com >

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

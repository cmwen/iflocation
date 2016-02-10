var Settings = require('settings');

var MAKER_KEY = 'maker';
var EVENTS_KEY = 'events';
var VALUES_KEY = 'values';


exports.MAKER_KEY = MAKER_KEY;
exports.EVENTS_KEY = EVENTS_KEY;
exports.VALUES_KEY = VALUES_KEY;
exports.IFTTT_TRIGGERS_DATA = 'iftttTriggers';
exports.CURRENT_LOCATION = 'cachedLocation';

// Settings.option(MAKER_KEY, "aaa");
// Settings.option(EVENTS_KEY, [{title: 'aaaaaa'},  {title: 'bbbbbbb'}]);
// Settings.option(VALUES_KEY, [{title: 'ccccccc'} , {title: 'ddddddd'}]);
//Set a configurable with the open callback
Settings.config(
  { url: 'http://cmwen.github.io/iflocation/setting.html' },
  function(e) {
//     console.log('opening configurable');
  },
  function(e) {
//     console.log('closed configurable');
    // Show the parsed response
//     console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

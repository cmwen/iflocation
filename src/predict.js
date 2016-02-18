'use strict';

var Wakeup = require('wakeup');
var IFTTT = require('iftttsettings');
var Vibe = require('ui/vibe');

// Try to find the next trigger time, the algorithm is simple,
// Use the avariege time to guest the next trigger time
// TODO only predict it's everything or every hours
exports.predict = function ( /*Array*/ history, /*fucntion*/ callback) {
  var PERIOD_AN_HOUR = 60 * 60 * 1000;
  var PERIOD_A_DAY = 24 * PERIOD_AN_HOUR;
  var PERIOD_A_WEEK = 7 * PERIOD_A_DAY;
  var PERIOD_A_MONTH = 30 * PERIOD_A_DAY;
  var PERIOD_A_YEAR = 365 * PERIOD_A_DAY;

  if (history && history.length > 3) {
    var previousTime = 0;
    var time = [];
    for (var i = 0; i < history.length; i++) {
      if (previousTime > 0) {
        time.push(history[i] - previousTime);
      }
      previousTime = history[i];
    }

    var sum = 0;
    for (i = 0; i < time.length; i++) {
      sum += time[i];
    }

    /** in seconds */
    var nextTime = (sum / time.length) / 1000;
    if (nextTime < 60) {
      // Pebble wake up must be at least 1 minute
      nextTime = 60;
    }
    console.log("Next time: " + nextTime);

    // TODO store the Wakeup id, and when this app is launched, we can preselect the trigger
    Wakeup.schedule({
        time: Date.now() / 1000 + nextTime
      },
      function(e) {
        if (e.failed) {
          console.log('Wakeup set failed: ' + e.error);
        } else {
          console.log('Wakeup set! Event ID: ' + e.id);
          callback(e);
        }
      }
    );
}
};

// Single wakeup event handler example:
Wakeup.on('wakeup', function(e) {
  Vibe.vibrate('short');
  console.log('Wakeup event! ' + JSON.stringify(e));
});

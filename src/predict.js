'use strict';

var Wakeup = require('wakeup');
var IFTTT = require('iftttsettings');
var Vibe = require('ui/vibe');

// Try to find the next trigger time, the algorithm is simple, if all the time
// between all history is below our threshHold(30mins), then assume is predictable
// Then use the avariege time to guest the next trigger time
exports.predict = function ( /*Array*/ history) {
  var threshHold = 30 * 60 * 1000; // half hour

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
      if (time[i] < threshHold) {
        sum += time[i];
      } else {
        console.log("unable to predict");
        break;
      }
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
        time: nextTime
      },
      function(e) {
        if (e.failed) {
          console.log('Wakeup set failed: ' + e.error);
        } else {
          console.log('Wakeup set! Event ID: ' + e.id);
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

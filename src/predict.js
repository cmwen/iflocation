'use strict';

var Wakeup = require('wakeup');
var IFTTT = require('iftttsettings');
var Vibe = require('ui/vibe');
var Triggers = require('triggers');


// Try to find the next trigger time, the algorithm is simple,
// Use the avariege time to guest the next trigger time
exports.predict = function ( /*Array*/ history, /*fucntion*/ callback) {
  var PERIOD_AN_HOUR = 60 * 60 * 1000;
  var PERIOD_A_DAY = 24 * PERIOD_AN_HOUR;

  if (history && history.length > 3) {
    var previousTime = 0;
    var time = [];
    for (var i = 0; i < history.length; i++) {
      if (previousTime > 0) {
        time.push(Math.abs(history[i] - previousTime));
      }
      previousTime = history[i];
    }

    var days = [];
    var hours = [];
    for (i = 0; i < time.length; i++) {
      // if days
      var day = Math.round(time[i] / PERIOD_A_DAY);
    
      if (day > 1) {
        days.push(time[i]);
      } else {
        var hour = Math.round(time[i] / PERIOD_AN_HOUR);
    
        if (hour > 1) {
          hours.push(time[i]);
        }
      }
    }
    
    var nextTime = 0;
    var sum = 0;
    if (days.length > hours.length) {
      for (i = 0; i < days.length; i++) {
        sum += days[i];
      }
      nextTime = sum / days.length;
    } else if (days.length < hours.length) {
      for (i = 0; i < hours.length; i++) {
        sum += hours[i];
      }
      nextTime = sum / hours.length;
    } else {
      console.log("Unable to predict");
    }

    if (nextTime > 0) {
    /** in seconds */
    if (nextTime < 60000) {
      // Pebble wake up must be at least 1 minute
      nextTime = 60000;
    }
    console.log("Next time: " + nextTime);

    // TODO store the Wakeup id, and when this app is launched, we can preselect the trigger
    Wakeup.schedule({
        time: (Date.now() + nextTime) / 1000
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
}
};

// Single wakeup event handler example:
Wakeup.on('wakeup', function(e) {
  Vibe.vibrate('short');
  console.log('Wakeup event! ' + JSON.stringify(e));
  var triggers = IFTTT.getTriggers();
  for (var i = 0; triggers && i < triggers.length; i++) {
    if (triggers[i] && triggers[i].wakeupId == e.id) {
      var triggerCard = Triggers.getQuickTriggerCard(triggers[i]);
      triggerCard.show();
    }
  }
});

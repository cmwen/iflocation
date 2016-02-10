'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Values = require('values');
var Events = require('events');
var ajax = require('ajax');
var Wakeup = require('wakeup');

var IFTTT = require('iftttsettings');

/**
Default Value:
Location
Current Date
Current Time

Action:
Done

trigger {
  title: evnet name + first value,
  subtitle: three values,
  value: {value1, value2, value3}, IFTTT maker format
  counter: trigger tiems, used for sorting,
  history: [time of last executed], used to predict next trigger, 3 maybe
}
*/

/**
 * Default Menu items
 */
var ADD_NEW_TRIGGER = 'New Trigger';
var RESET_TRIGGERS = 'Delete All Triggers';

exports.getTriggersMenu = function(/** function */ callback) {
    var menu = new UI.Menu({
      sections: [
        {
          title: "Triggers"
        },
        {
          title: "Actions",
          items: [
            { title: ADD_NEW_TRIGGER }, {title: RESET_TRIGGERS}
          ]
        }
      ]
    });

  menu.on('select', function(e) {
    if (e.item.title == ADD_NEW_TRIGGER) {
      var eventMenu = Events.getEventsMenu();
      eventMenu.show();
    } else if (e.item.title == RESET_TRIGGERS) {
      Settings.data(IFTTT.IFTTT_TRIGGERS_DATA , null);
      e.menu.items(0, []);
    } else {
      // increse the counter for selected trigger
      e.item.counter++;

      var makerUrl = "https://maker.ifttt.com/trigger/" + e.item.event + "/with/key/" + Settings.option(IFTTT.MAKER_KEY);
      var value = {value1: replaceValue(e.item.value.value1),
                value2: replaceValue(e.item.value.value2),
                value3: replaceValue(e.item.value.value3)};
      // Callback function for ajax call, showing Ok or Fail message
      var ajaxCallback = function (data, status, request) {
        if (status == 200) {
              var successMessage = new UI.Card({
              title: 'Success',
              body: e.item.title + ' was triggered successfully.'
            });
          successMessage.show();
          setTimeout(function(){successMessage.hide();}, 2000);

          // vibrate to indicate it's success.
          Vibe.vibrate('short');
          // Update history
          // TODO only keep 7(7 a week?) logs, make sure it updates the right item
          e.item.history.push(Date.now());

          // Guess what's the next time you will trigger this event
          predict(e.item.history);

          // Update triggers
          var triggers = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
          var pos = triggers.indexOf(e.item);
          triggers.splice(pos, 1, e.item);
          Settings.data(IFTTT.IFTTT_TRIGGERS_DATA , triggers);
        } else {
          var failedMessage = new UI.Card({
              title: 'Failed',
              body: 'Unable to trigger ' + e.item.title + ', please check your setting and try again.'
            });
          failedMessage.show();
        }
      }

      ajax(
        {
          url: makerUrl,
          method: 'post',
          type: 'json',
          data: value
        },
        ajaxCallback , ajaxCallback
      );
    }
  });

  // Update triggers from data store when this menu is showing
  menu.on('show', function(e){
    var triggers = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
    if (triggers) {
      // Sort the triggers by the counter, so the most frequent used will go first
      triggers = triggers.sort(function (a, b) {
          return a.counter < b.counter;
      });

      e.menu.items(0, triggers);
      e.menu.selection(0, 0);
    }
  });

  // Long Select to remove a single trigger
  // TODO not working probably
  menu.on('longSelect', function(e) {
    if (e.sectionIndex == 0) {
      var triggers = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
      var pos = triggers.indexOf(e.item);
      triggers = triggers.splice(pos, 1);
      Settings.data(IFTTT.IFTTT_TRIGGERS_DATA , triggers);
      e.menu.items(0, triggers);
    }
  });

  return menu;
}

// TODO more format?
function replaceValue(value) {
  if (value) {
    if (value == "Location") {
      var position = Settings.data(IFTTT.CURRENT_LOCATION);

      return position.coords.latitude + "," + position.coords.longitude;
    } else if (value == "Time") {
        return Date.now();
    }
    return value;
  }
}

// Try to find the next trigger time, the algorithm is simple, if all the time
// between all history is below our threshHold(30mins), then assume is predictable
// Then use the avariege time to guest the next trigger time
// TODO this should be a opt in function
function predict (/*Array*/history) {
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
    for (var i = 0; i < time.length; i++) {
      if (time[i] < threshHold) {
        sum += time[i];
      } else {
        console.log("unable to predict");
        break;
      }
    }

    /** in seconds */
    var nextTime = (sum/time.length) / 1000;
    if (nextTime < 60) {
      // Pebble wake up must be at least 1 minute
      nextTime = 60;
    }
    console.log("Next time: " + nextTime);

    // TODO store the Wakeup id, and when this app is launched, we can preselect the trigger
    Wakeup.schedule(
      { time: nextTime },
        function(e) {
          if (e.failed) {
            console.log('Wakeup set failed: ' + e.error);
          } else  {
            console.log('Wakeup set! Event ID: ' + e.id);
          }
        }
      )
  }
}

// Single wakeup event handler example:
Wakeup.on('wakeup', function(e) {
  Vibe.vibrate('short');
  console.log('Wakeup event! ' + JSON.stringify(e));
});

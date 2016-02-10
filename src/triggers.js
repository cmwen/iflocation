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

var ADD_NEW_TRIGGER = 'Add New Trigger';
var RESET_TRIGGERS = "Reset Triggers";

exports.getTriggersMenu = function(/** function */ callback) {
      var menu = new UI.Menu({
      sections: [
        {
          title: "Saved Triggers"
        },
        {
          title: "New Trigger",
          items: [
            { title: ADD_NEW_TRIGGER }, {title: RESET_TRIGGERS}
          ]
        }
      ]
    });

  var iftttEvent = {title: '', value: {}};
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
      var ajaxCallback = function (data, status, request) {
        if (status == 200) {
              var successMessage = new UI.Card({
              title: 'Success',
              body: e.item.title + ' was triggered successfully.'
            });
          successMessage.show();
          setTimeout(function(){successMessage.hide();}, 2000);
          Vibe.vibrate('long');
          e.item.history.push(Date.now());
          predict(e.item.history);
          var triggers = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
          var pos = triggers.indexOf(e.item);
          tigger.splice(pos, 1, e.item);
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
//     navigator.geolocation.getCurrentPosition(function(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
  });

  menu.on('show', function(e){
    var triggers = Settings.data(IFTTT.IFTTT_TRIGGERS_DATA);
    if (triggers) {
      triggers = triggers.sort(function (a, b) {
          return a.counter < b.counter;
      });
      e.menu.items(0, triggers);
      e.menu.selection(0, 0);
    }
  });

  /** Long Select to remove a single trigger */
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
    var nextTime = sum/time.length;
    console.log("Next time: " + nextTime);

    Wakeup.schedule(
      { time: nextTime/1000 },
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
  console.log('Wakeup event! ' + JSON.stringify(e));
});

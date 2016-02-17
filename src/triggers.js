'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Events = require('events');
var ajax = require('ajax');
var Predict = require('predict');
var Detail = require('triggerDetail');
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
  wakeupId: id to get he wakeup
}
*/

/**
 * Default Menu items
 */
var ADD_NEW_TRIGGER = 'New Trigger';
var RESET_TRIGGERS = 'Delete All Triggers';
var PREDICT = 'Predict:';

// TODO check if there is anyevent for leaving this menu, should do the
// data persist stuff when user leave this menu
exports.getTriggersMenu = function( /** function */ callback) {
  var menu = new UI.Menu({
    sections: [{
      title: "Triggers"
    }, {
      title: "Actions",
      items: [{
        title: ADD_NEW_TRIGGER,
        subtitle: "Add a new Trigger"
      }, {
        title: RESET_TRIGGERS
      }, {
        title: PREDICT + IFTTT.predict(),
        subtitle: "Predcit next trigger"
      }]
    }]
  });

  menu.on('select', function(e) {
    if (e.item.title == ADD_NEW_TRIGGER) {
      var eventMenu = Events.getEventsMenu();
      eventMenu.show();
    } else if (e.item.title == RESET_TRIGGERS) {
      Settings.data(IFTTT.IFTTT_TRIGGERS_DATA, null);
      e.menu.items(0, []);
    } else if (e.item.title.indexOf(PREDICT) == 0) {
      var enabled = IFTTT.predict();
      IFTTT.predict(!enabled);
//       e.item.title = PREDICT + IFTTT.predict();
      e.menu.item(e.sectionIndex, e.itemIndex, {title: PREDICT + IFTTT.predict()});
//       console.log(IFTTT.predict());
    } else {
      // increse the counter for selected trigger
      e.item.counter++;

      var makerUrl = "https://maker.ifttt.com/trigger/" + e.item.event + "/with/key/" + Settings.option(IFTTT.MAKER_KEY);
      var value = {
        value1: replaceValue(e.item.value.value1),
        value2: replaceValue(e.item.value.value2),
        value3: replaceValue(e.item.value.value3)
      };
      // Callback function for ajax call, showing Ok or Fail message
      var ajaxCallback = function(data, status, request) {
        if (status == 200) {
          var successMessage = new UI.Card({
            title: 'Success',
            body: e.item.title + ' was triggered successfully.'
          });
          successMessage.show();
          setTimeout(function() {
            successMessage.hide();
          }, 2000);

          // vibrate to indicate it's success.
          Vibe.vibrate('short');

          // Update history
          // Only keep 7(7 a week?) logs, make sure it updates the right item
          if (!e.item.history) {
            e.item.history = [];
          }
          e.item.history.push(Date.now());
          if (e.item.history.length > 7) {
            e.item.history = e.item.history.shift();
          }


          if (IFTTT.predict()) {
            // Guess what's the next time you will trigger this event
            Predict.predict(e.item.history, function(innerE){
              if (e.item.wakeupId) {
                Wakeup.cancel(e.item.wakeupId);
              }
              e.item.wakeupId = innerE.id;
              IFTTT.updateTrigger(e.item);

            });
          }
          IFTTT.updateTrigger(e.item);
        } else {
          var failedMessage = new UI.Card({
            title: 'Failed',
            body: 'Unable to trigger ' + e.item.title + ', please check your setting and try again.'
          });
          failedMessage.show();
        }
      };

      ajax({
          url: makerUrl,
          method: 'post',
          type: 'json',
          data: value
        },
        ajaxCallback, ajaxCallback
      );
    }
  });

  // Update triggers from data store when this menu is showing
  menu.on('show', function(e) {
    var triggers = IFTTT.getTriggers();
    if (triggers) {
      // Sort the triggers by the counter, so the most frequent used will go first
      triggers = triggers.sort(function(a, b) {
        return a.counter < b.counter;
      });

      e.menu.items(0, triggers);
      e.menu.selection(0, 0);
    }
  });

  menu.on('hide', function(e) {

  });

  // Long Select to show detail of a trigger
  menu.on('longSelect', function(e) {
    var detail = Detail.detailView(e.item);
    detail.show();
  });

  return menu;
};

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

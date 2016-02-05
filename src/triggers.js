'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Values = require('values');
var Events = require('events');
var ajax = require('ajax');

var IFTTT = require('iftttsettings');


/**
Default Value:
Location
Current Date
Current Time

Action:
Done
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
      var makerUrl = "https://maker.ifttt.com/trigger/" + e.item.event + "/with/key/" + Settings.option(IFTTT.MAKER_KEY);
    var data = {value1: replaceValue(e.item.value.value1), 
                value2: replaceValue(e.item.value.value2),
                value3: replaceValue(e.item.value.value3)};
    console.log(JSON.stringify(data));
    var ajaxCallback = function (data, status, request) {
  if (status == 200) {
              var successMessage = new UI.Card({
              title: 'Success',
              body: e.item.title + ' was triggered successfully.'
            });
          successMessage.show();
          setTimeout(function(){successMessage.hide();}, 2000);

          Vibe.vibrate('long');
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
          type: 'json',
          data: data
        },
        ajaxCallback , ajaxCallback
      );
    }
//     navigator.geolocation.getCurrentPosition(function(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
  });
  
  menu.on('show', function(e){
    if (Settings.data(IFTTT.IFTTT_TRIGGERS_DATA)) {
      e.menu.items(0, Settings.data(IFTTT.IFTTT_TRIGGERS_DATA));
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
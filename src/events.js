'use strict';

var Settings = require('settings');
var Values = require('values');
var UI = require('ui');
var IFTTT = require('iftttsettings');


exports.getEventsMenu = function(/** function */ callback) {
 var eventMenu = new UI.Menu({
        sections: [
          {
            title: "Select Event"
          }
        ]
      });
      
      if (Settings.option(IFTTT.EVENTS_KEY)) {
        eventMenu.items(0, Settings.option(IFTTT.EVENTS_KEY));
      } else {
          var noEventMessage = new UI.Card({
              title: 'No event',
              body: "No event can be used."
            });
          noEventMessage.show();
      }
      
      eventMenu.on('select', function(e){
        var valueMenu = Values.getValuesMenu(e.item, function(values) {
          e.menu.hide();
        });        

        valueMenu.show();
      });
  return eventMenu;
}
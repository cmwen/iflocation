/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
'use strict';

var UI = require('ui');
var Settings = require('settings');
var IFTTT = require('iftttsettings');
var Triggers = require('triggers');

Pebble.getTimelineToken(function(success){
  console.log("success " + success);
}, function(failure) {
  console.log("faile " + failure);
});

if (!Settings.option(IFTTT.MAKER_KEY)) {
  var main = new UI.Card({
    title: 'ifLocation',
    subtitle: 'No IFTTT settings',
    body: 'Please open settings on mobile to setup IFTTT maker channel.',
    action: {
      up: 'images/1.png',
      down: 'VALUE_2'
    }
    
  });
  main.show();
} else {
  var triggersMenu = Triggers.getTriggersMenu();
  triggersMenu.show();
  navigator.geolocation.getCurrentPosition(function(position) {
//     console.log(position.coords.latitude, position.coords.longitude);
    Settings.data(IFTTT.CURRENT_LOCATION, position);
  });
}
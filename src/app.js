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

// Code to get the timeline token, maybe ge used someday
/*Pebble.getTimelineToken(function(success){
  console.log("success " + success);
}, function(failure) {
  console.log("faile " + failure);
});*/

// Check if Maker key is ready, if not shows a message
if (!Settings.option(IFTTT.MAKER_KEY)) {
  var main = new UI.Card({
    title: 'ifLocation',
    subtitle: 'No IFTTT settings',
    body: 'Please open settings on mobile to setup your IFTTT maker channel.'
  });
  main.show();
} else {
  var triggersMenu = Triggers.getTriggersMenu();
  triggersMenu.show();

  // Cache location
  // TODO check if triggers are using location, if not, don't bother
  navigator.geolocation.getCurrentPosition(function(position) {
    Settings.data(IFTTT.CURRENT_LOCATION, position);
  });
}

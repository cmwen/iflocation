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

if (!Settings.option(IFTTT.MAKER_KEY)) {
  var main = new UI.Card({
    title: 'ifLocation',
    subtitle: 'No IFTTT settings',
    body: 'Please open settings on mobile to setup IFTTT maker channel.'
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
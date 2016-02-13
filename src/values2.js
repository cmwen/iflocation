'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vector2 = require('vector2');
var IFTTT = require('iftttsettings');
var Vibe = require('ui/vibe');


/**
Default Value:
Location
Current Date
Current Time

Action:
Done
*/


exports.getValuesMenu = function(event, /** function */ callback) {

  // Trigger format see triggers.js
  var iftttTrigger = {title: event.title, event: event.title, value: {}, counter: 0, history:[]};

  var menu = new UI.Card({
    title: 'Value1',
    action: {
      select: 'images/1.png'
    }
    });


  menu.on('select', function(e){
    console.log('select');
  });

  menu.on('show', function(e){
    console.log('show');
  });

  menu.on('hide', function(e) {
    console.log('hide');
  });

  return menu;
}

function valueString(value) {
  var result = '';
  if (value) {
    if (value.value1) {
      result = value.value1;
    }
    if (value.value2) {
      result += ',' + value.value2;
    }
    if (value.value3) {
      result += ',' + value.value3;
    }
  }
  return result;
}

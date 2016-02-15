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
  var values = IFTTT.values();

  // Trigger format see triggers.js
  var iftttTrigger = {title: event.title, event: event.title, value: {}, counter: 0, history:[]};
  // Valuses going to pick, eg, 1, 2, 3
  var valueCounter = 1;
  // Index of values, used to decide which value is going to show
  var indexCounter = 0;

  var card = new UI.Card({
    title: 'Loading',
    action: {
      select: 'images/1.png'
    }
    });


  card.on('click', 'select', function(e){
    console.log('select');
  });

  card.on('click', 'back', function(e){
    console.log('back');
  });

  card.on('click', 'up', function(e){
    console.log('back');
  });

  card.on('click', 'down', function(e){
    console.log('back');
  });

  card.on('show', function(e){
    console.log('show');
    if (indexCounter > values.length) {
      // shows redefined values
    } else {
      card.title(values[indexCounter].title);
      card.body(values[indexCounter].title);
    }
  });

  card.on('hide', function(e) {
    console.log('hide');
  });

  return card;
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

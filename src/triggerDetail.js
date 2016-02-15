'use strict';

var UI = require('ui');
var Settings = require('settings');
var Vibe = require('ui/vibe');
var Events = require('events');
var ajax = require('ajax');
var Predict = require('predict');

var IFTTT = require('iftttsettings');

/** Detail view for Triggers */
// TODO Shows Wakeup as well
exports.detailView = function (/*obejct*/ trigger) {
  var body = "";
  if (trigger.value) {
    body += "Value1:" + trigger.value.value1;
    body += "Value2:" + trigger.value.value2;
    body += "Value3:" + trigger.value.value3;
  }

  if (trigger.counter) {
    body += "Count:" + trigger.counter;
  }

  if (trigger.history) {
    body += "History:";
    for (var i = 0; i < trigger.history.length; i ++) {
      var date = new Date(trigger.history[i]);
      // TODO use the interval to decide the format
      body += date.toLocaleDateString();
    }
  }

  var card = new UI.Card({
    title: trigger.title,
    subtitle: trigger.subtitle,
    scrollable: true,
    body: body
  });

  card.on('click', 'select', function(e){
    //TODO Delete Here?
  });

  return card;
}

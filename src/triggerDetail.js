'use strict';

var UI = require('ui');
var Wakeup = require('wakeup');


/** Detail view for Triggers */
// TODO Shows Wakeup as well
exports.detailView = function (/*obejct*/ trigger) {
  var body = "";
  var options = {  month: 'numeric', day: 'numeric' , hour: 'numeric', minute: 'numeric'};

  if (trigger.value) {
    if (trigger.value.value1) {
      body += "Value1:" + trigger.value.value1;
    }
    if (trigger.value.value2) {
      body += "\nValue2:" + trigger.value.value2;
    }

    if (trigger.value.value3) {
      body += "\nValue3:" + trigger.value.value3;
    }
  }

  if (trigger.counter) {
    body += "\nCount:" + trigger.counter;
  }

  if (trigger.history) {
    body += "\nHistory:";
    for (var i = 0; i < trigger.history.length; i ++) {
      var date = new Date(trigger.history[i]);
      // TODO use the interval to decide the format
      body += "\n" + date.toLocaleString(navigator.language, options);
    }
  }
  
  if (trigger.wakeupId) {
    var storeWakeup = Wakeup.get(trigger.wakeupId);
    if (storeWakeup) {
      var nextTime = new Date(storeWakeup.time);
      body += "\nNext Wakeup:\n" + nextTime.toLocaleString(navigator.language, options);
    }
  }

  var card = new UI.Card({
    title: trigger.title,
    scrollable: true,
    body: body
  });

  card.on('click', 'select', function(e){
    //TODO Delete Here?
  });

  return card;
}

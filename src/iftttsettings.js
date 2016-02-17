var Settings = require('settings');

var MAKER_KEY = 'maker';
var EVENTS_KEY = 'events';
var VALUES_KEY = 'values';

var PREDICT_KEY = 'predict_key';

exports.MAKER_KEY = MAKER_KEY;
exports.EVENTS_KEY = EVENTS_KEY;
exports.VALUES_KEY = VALUES_KEY;

var TRIGGERS_DATA = 'iftttTriggers';

exports.IFTTT_TRIGGERS_DATA = TRIGGERS_DATA;
exports.CURRENT_LOCATION = 'cachedLocation';

/*Settings.option(MAKER_KEY, "cfE1_JYs_ybdmuif7zYE-z");
Settings.option(EVENTS_KEY, [{title: 'aaaaaa'},  {title: 'bbbbbbb'}]);
Settings.option(VALUES_KEY, [{title: 'ccccccc'} , {title: 'ddddddd'}]);

var triggers = [];

triggers.push({
  title: "Test Trigger",
  subtitle: "Test Trigger[value1]",
  value: {value1: "value1", value2: "value2", value3: "value3"}, 
  counter: 2,
  history: [14000, 15000, 16000, 17000],
  wakeupId: -1
});
Settings.data(TRIGGERS_DATA, triggers);*/

//Set a configurable with the open callback
Settings.config(
  { url: 'http://cmwen.github.io/iflocation/setting.html' },
  function(e) {
//     console.log('opening configurable');
  },
  function(e) {
//     console.log('closed configurable');
    // Show the parsed response
//     console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

exports.enabledBetaFunction = function() {
  return true;
};

exports.predict = function(/*boolean*/ p_enable) {
  if (Settings.option(PREDICT_KEY) === undefined) {
    Settings.option(PREDICT_KEY, true);
  }
  
  if (p_enable === undefined) {
    return Settings.option(PREDICT_KEY);
  } else {
    return Settings.option(PREDICT_KEY, p_enable);
  }
};

exports.values = function (/**/ values) {
  var result;
  if (values === undefined) {
    result = Settings.option(VALUES_KEY);
  } else {
    result = Settings.option(VALUES_KEY, values);
  }  

  if (!result) {
    result = [];
  }
  return result;
};

exports.getTriggers = function(){
  return Settings.data(TRIGGERS_DATA);
};

exports.deleteTrigger = function (/**trigger*/ trigger) {
      var triggers = Settings.data(TRIGGERS_DATA);
      var pos = triggers.indexOf(trigger);
  console.log("Delete trigger at : " + pos);
      triggers.splice(pos, 1);
      Settings.data(TRIGGERS_DATA, triggers);
}

exports.updateTrigger = function (/**Object*/ trigger) {
           // Update triggers
          var triggers = Settings.data(TRIGGERS_DATA);
          var pos = triggers.indexOf(trigger);
          if (pos >= 0) {
          triggers.splice(pos, 1, trigger);
          Settings.data(TRIGGERS_DATA, triggers);
          } else {
            console.log("Unable to find trigger to update");
          }

 
}
 
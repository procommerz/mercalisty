// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .
//= require_self


window.sendGaEvent = function(category, action, label, value) {
  if (window.trackingOptOut)
    return;

  // console.log("Tracking", "sendEvent", category, action, label, value);

  var params = {
    eventCategory: category,
    eventAction: action
  };

  if (label) params.eventLabel = label;
  if (value) params.eventValue = value;

  params.transport = 'beacon';

  if (window.ga) {
    try {
      ga('send', 'event', params);
    } catch(e) {
      console.warn(e);
    }
  } else {
    setTimeout(function() {
      sendGaEvent(category, action, label, value);
    }, 300);
  }
};
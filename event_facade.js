/**
 * Creates a new EventFacade. Provides debugging and logs events to condsole.
 * @class
 */

function EventFacade(options) {
  this.enableDebug = false;
  mix(options, this); // mix
}

EventFacade.prototype = {
  /**
   * @param {string} eventName - Listen for this event
   * @param {function} callback - Callback function
   * @param {string} context - Context
   */
  bind: function(eventName, callback, context, target) {

    // enableDebug
    if (this.enableDebug) {
      console.log('%cbind: ' + eventName, 'color: #91cc83; font-weight: bold; line-height: 1.5');
      // console.log('%ccallback: ' + callback.toString(), 'color: #bbb; line-height: 1.5');
    }
   // this.debug('bind=' + eventName + '|callback=' + callback.toString());

    // EVENTS
    if (target)
    {
      $(target).unbind(eventName, $.proxy(callback, context)); // unbind first
      $(target).bind(eventName, $.proxy(callback, context));
    }
    else
    {
      $(document).unbind(eventName, $.proxy(callback, context)); // unbind first
      $(document).bind(eventName, $.proxy(callback, context));
    }
  },

  /**
   * @param {string} eventName - Name of event to trigger
   * @param {function} argsArray - Array of arguments
   */
  trigger: function(eventName, argsArray) {

    // enableDebug
    if (this.enableDebug) {
      console.log('%ctrigger: ' + eventName, 'color: #00a7e1; font-weight: bold; line-height: 1.5');
      //console.log('%cargsArray: ' + JSON.stringify(argsArray), 'color: #bbb; line-height: 1.5');
    }
    // this.debug('trigger=' + eventName + 'argsArray=' + JSON.stringify(argsArray));

    // EVENTS
    $(document).trigger(eventName, argsArray);
  },

  /** Remove all binds */
  unbindAll: function() {
    $(document).unbind();
  },

  debug: function(msg){
    var message = 'prototype=EventFacade|' + msg;
    new LogModel().create(message);
    if (this.enableDebug)
      console.log(message);
  }
};

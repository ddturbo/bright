/*!
 * Bright 0.0.5
 *
 * Copyright 2012, Sergiy Lavryk (jagermesh@gmail.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
  * http://brightfw.com
 *
 */

;(function (window) {

  function BrEventQueue(obj) {

    var _this = this;

    this.subscribers = {};
    this.connections = [];
    this.obj = obj || this;

    this.before = function(events, callback) {
      events = events.split(',');
      for(var i = 0; i < events.length; i++) {
        _this.subscribers[events[i]] = _this.subscribers[events[i]] || { on: [], before: [], after: [] };
        _this.subscribers[events[i]].before.push(callback);
      }
    };

    this.on = function(events, callback) {
      events = events.split(',');
      for(var i = 0; i < events.length; i++) {
        _this.subscribers[events[i]] = _this.subscribers[events[i]] || { on: [], before: [], after: [] };
        _this.subscribers[events[i]].on.push(callback);
      }
    };

    this.after = function(events, callback) {
      events = events.split(',');
      for(var i = 0; i < events.length; i++) {
        _this.subscribers[events[i]] = _this.subscribers[events[i]] || { on: [], before: [], after: [] };
        _this.subscribers[events[i]].after.push(callback);
      }
    };

    this.has = function(eventName) {
      return _this.subscribers.hasOwnProperty(eventName);
    };

    this.connectTo = function(eventQueue) {
      _this.connections.push(eventQueue);
    };

    function trigger(event, pos, args) {

      var result = null;
      var eventSubscribers = _this.subscribers[event];
      var i;

      if (eventSubscribers) {
        switch (pos) {
          case 'before':
            for (i = 0; i < eventSubscribers.before.length; i++) {
              eventSubscribers.before[i].apply(_this.obj, args);
            }
            break;
          case 'on':
            for (i = 0; i < eventSubscribers.on.length; i++) {
              result = eventSubscribers.on[i].apply(_this.obj, args);
            }
            break;
          case 'after':
            for (i = 0; i < eventSubscribers.after.length; i++) {
              eventSubscribers.after[i].apply(_this.obj, args);
            }
            break;
        }
      }

      return result;

    }

    this.triggerEx = function(event, pos, largs) {

      var args = [];
      var i;

      for(i = 0; i < largs.length; i++) {
        args.push(largs[i]);
      }

      if (event != '*') {
        trigger('*', pos, args);
      }

      args.splice(0,1);

      var result = trigger(event, pos, args);

      for (i = 0; i < _this.connections.length; i++) {
        _this.connections[i].triggerEx(event, pos, largs);
      }

      return result;

    };

    this.triggerBefore = function(event) {
      return this.triggerEx(event, 'before', arguments);
    };

    this.trigger = function(event) {
      return this.triggerEx(event, 'on',     arguments);
    };

    this.triggerAfter = function(event) {
      return this.triggerEx(event, 'after',  arguments);
    };

  }

  window.br = window.br || {};

  window.br.eventQueue = function(obj) {
    return new BrEventQueue(obj);
  };

})(window);

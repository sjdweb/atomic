/*! atomic v1.0.0 | (c) 2015 @toddmotto | github.com/toddmotto/atomic */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.atomic = factory(root);
  }
})(this, function (root) {

  'use strict';

  var exports = {};

  var parse = function (req) {
    var result;
    try {
      result = JSON.parse(req.responseText);
    } catch (e) {
      result = req.responseText;
    }
    return [result, req];
  };

  var xhr = function (type, url, data, headers) {
    var methods = {
      success: function () {},
      error: function () {}
    };
    var XHR = root.XMLHttpRequest || ActiveXObject;
    var request = new XHR('MSXML2.XMLHTTP.3.0');
    request.open(type, url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    if (headers && (typeof headers === 'object')) {
      for (var headerKey in headers) {
        request.setRequestHeader(headerKey, headers[headerKey]);
      }
    }
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        var okStatuses = [200, 201, 202, 203, 204];
        if (okStatuses.indexOf(request.status) > -1) {
          methods.success.apply(methods, parse(request));
        } else {
          methods.error.apply(methods, parse(request));
        }
      }
    };
    request.send(data);
    return {
      success: function (callback) {
        methods.success = callback;
        return methods;
      },
      error: function (callback) {
        methods.error = callback;
        return methods;
      }
    };
  };

  exports['get'] = function (src, headers) {
    return xhr('GET', src, null, headers);
  };

  exports['put'] = function (url, data, headers) {
    return xhr('PUT', url, data, headers);
  };

  exports['post'] = function (url, data, headers) {
    return xhr('POST', url, data, headers);
  };

  exports['delete'] = function (url, headers) {
    return xhr('DELETE', url, null, headers);
  };

  return exports;

});

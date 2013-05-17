/*global define, toastr*/
define(['durandal/system'],
    function (system) {
      var logger = {
        log: log,
        logError: logError,
        logSuccess: logSuccess,
        logWarning: logWarning
      };

      return logger;

      function log(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'info');
      }

      function logError(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'error');
      }

      function logSuccess(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'success');
      }

      function logWarning(message, data, source, showToast) {
        logIt(message, data, source, showToast, 'warning');
      }

      function logIt(message, data, source, showToast, toastType) {
        source = source ? '[' + source + ']' : '';
        if (data) {
          system.log(message, source, data);
        } else {
          system.log(message, source);
        }
        if (showToast) {
          if ($.inArray(toastType, ['error', 'success', 'warning']) > -1) {
            toastr[toastType](message);
          } else {
            toastr.info(message);
          }
        }
      }
    });
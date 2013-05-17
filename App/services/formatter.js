/*global define*/
define(function () {

  //public methods
  var formatter = {
    userName: userName,
    fileName: fileName,
    dateLong: dateLong,
    date: date
  };

  return formatter;


  // internal
  function userName(field) {
    return field.userName;
  }

  function dateLong(field) {
    if (typeof field.format === 'function') {
      return field.format('F');
    }
  }

  function date(field) {
    if (typeof field.format === 'function') {
      return field.format(this.args || 'F');
    }
  }



  function fileName(field) {
    return field.substring(field.indexOf(';#') + 2);
  }

});


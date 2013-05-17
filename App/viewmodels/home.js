define(['services/logger'],
  function (logger) {
    var vm = {
        activate: activate,
        title: 'Home View'
    };

    return vm;

    //#region Internal Methods
    function activate() {
      logger.log('Activating Home View', null, 'home', true);
      return true;
    }
    //#endregion
});
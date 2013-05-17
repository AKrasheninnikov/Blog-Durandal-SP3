define(['durandal/system', 'durandal/plugins/router', 'services/logger', 'config'],
    function (system, router, logger, config) {
      var shell = {
        activate: activate,
        router: router
      };

      return shell;

      //#region Internal Methods
      function activate() {
        return boot();
      }

      function boot() {
        router.map(config.routes);

        return router.activate('home');
      }
      
      //#endregion
    });
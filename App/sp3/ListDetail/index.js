/*!
* Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
/*global define, ko, sp3, L_Menu_BaseUrl */
define(['services/spdata', './grid'],
  function (spdata, Grid) {

  
    var ctor = function (options) {
      var self = this;
      // Preserve constructor options
      this.options = options || {};
      this.fields = [];
      this.init(options);

    };

    ctor.prototype.init = function (options) {
      options || (options = {});

      this.webUrl = options.webUrl || L_Menu_BaseUrl;
      this.listName = options.listName || '';

    };
    
    ctor.prototype.key = function () {
      var path = this.webUrl.replace(/^\/+|\/+$/g, '');
      return '/' + path.toLowerCase() + '/' + this.listName.toLowerCase();
    };

    // Durandal viewmodel functions

    ctor.prototype.activate = function (routerdata) {

      if (routerdata && routerdata.id) {
        this.listName = routerdata.id;
      }

      var self = this;
      var getModelOptions = {
        listName: this.listName,
        webUrl: this.webUrl,
        key: this.key()
      };

      // Step 1: Create a Json list model based on SPServices 'GetList' method
      // spdata.getModel() returns either a promise or a cached result -> use $.when() to resolve
      // see http://lostechies.com/derickbailey/2012/03/27/providing-synchronous-asynchronous-flexibility-with-jquery-when/

      return $.when(spdata.getModel(getModelOptions)).then(function (data) {

        // Todo: Move to viemmodel init method and call self.init(data) instead 
        //store produced json 
        self.listInfo = data;

        $.each(data.fields, function (prop, obj) {
          if (!obj.Hidden) {
            if (typeof obj.Sortable === 'undefined') {
              self.fields.push(obj);
              return;
            }
            if (obj.Sortable) {
              self.fields.push(obj);
              return;
            }
          }
        });

        self.Grid = new Grid(self);
      });
    };

    ctor.prototype.deactivate = function () {
      delete sp3.dataSources[this.key()];
    };

    return ctor;

  });
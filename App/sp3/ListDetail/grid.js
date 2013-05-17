/*!
* Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
/*global define, ko, L_Menu_BaseUrl */
define(['services/spdata', 'services/logger', './gridConfig'],
  function (spdata, logger, gridConfig) {

    var Sort = function (options) {
      options = (options || {});
      this.field = ko.observable(options.field || 'ID');
      this.dir = ko.observable(options.dir || 'asc');
    };

    // thead column field
    var Field = function (options) {
      var self = this;
      var defaults = {
        sortable: true,
        width: null
      };

      options = (options || {});
      
      this.sorted = ko.observable(false);
      this.sortAsc = ko.observable(false);

      this.init = function () {

        //$.each(['sorted', 'sortAsc'], function (idx, prop) {
        //  if (options[prop]) {
        //    self[prop](options[prop]);
        //  }
        //});

        // whitelist of allowd properties
        $.each(['field', 'title', 'width', 'template', 'sortable', 'args'], function (idx, prop) {
          if (options[prop] || defaults[prop]) {
            self[prop] = (options[prop] || defaults[prop]);
          }
        });
      }

      this.getColStyle = function () {
        var width;
        if (typeof self.width === 'number') {
          width = self.width + 'px';
        }
        else if (typeof self.width === 'string') {
          if (self.width.indexOf('px') > -1 || self.width.indexOf('%') > -1) {
            width = self.width;
          }
        }
        return width ? 'width:' + width : '';
      };


      this.init();

      return self;
      
    };

    var ctor = function (model) {
      var self = this;
      if (!model) {
        logger.logError('Invalid model', this, 'grid.js', true);
        return;
      }
      this.model = model;

      this.pagingHistory = [''];
      this.viewFields = [];

      // ko observables
      this.ListItemCollectionPositionNext = ko.observable('');
      this.listItems = ko.observableArray([]);
      this.isFetching = ko.observable(false);
      this.page = ko.observable(1);
      this.itemCount = ko.observable(0);
      this._sort = ko.observableArray([]);
      this._pageSize = ko.observable();

      // ko computed
      this.hasPrevious = ko.computed(function () {
        return (self.page() > 1);
      });

      this.hasNext = ko.computed(function () {
        return (self.ListItemCollectionPositionNext() !== '');
      });

      this.paging = ko.computed(function () {
        var from = 1;
        var to = 0;
        var isEmpty = !self.hasNext() && !self.hasPrevious() && self.itemCount() === 0;

        // No results
        if (isEmpty) {
          from = 0;
          to = 0;
        }
        else {
          from = ((self.page() - 1) * self._pageSize()) + 1;
          to = self.page() * self._pageSize();

          // Edge case last page
          if (!self.hasNext()) {
            to = from + self.itemCount() - 1;
          }
        }

        return {
          page: self.page(),
          itemCount: self.itemCount(),
          from: from,
          to: to,
          hasNext: self.hasNext(),
          hasPrevious: self.hasPrevious(),
          isEmpty: isEmpty
        };
      });
     
    
      // instance function
      // Todo: Multiple sort support via header
      this.sortByHeader = function () {
        var dir = 'asc';
        if (this.field === self._sort()[0].field()) {
          dir = (self._sort()[0].dir() === 'asc') ? 'desc' : 'asc';
        }

        this.sorted(true);
        this.sortAsc((dir === 'asc'));

        //
        self.sort({ field: this.field, dir: dir });
      };

      // All set up, ready to rock;
      this.init(this.model);
    };

    ctor.prototype.init = function (model) {
      var self = this;
      var viewFields = [];
      model = (model || {});

      this.webUrl = model.webUrl || L_Menu_BaseUrl;
      this.listName = model.listName || '';
      this.baseType = parseInt(model.listInfo.info.BaseType, 10);
      this.serverTemplate = parseInt(model.listInfo.info.ServerTemplate, 10);

      this._pageSize(model.pageSize || gridConfig.pageSize);

      if (model.columns) {
        this.columns = model.columns;
      }
      // if exists use serverTemplate else baseType columns definition
      else {
        this.columns = ( gridConfig.columnsPerServerTemplate[this.serverTemplate] || gridConfig.columnsPerBaseType[this.baseType] );
      }

      
      // 
      $.each(this.columns, function (idx, obj) {
        // Ensure that each Field in the view is defined in viewFields
        viewFields.push(obj.field);

        self.columns[idx] = new Field(obj);
      });

      this.viewFields = $.unique((model.viewFields || gridConfig.viewFields).concat(viewFields));

      

     
      // refresh and fetch new data on observable change
      $.each(['_pageSize', '_sort'], function (idx, obj) {
        self[obj].subscribe(function (val) {
          self.refresh();
        });
      });


      // Todo: Add silent to sort
      this.sort(model.sort || gridConfig.sort);

      // Store the data source for later access
      sp3.dataSources[this.key()] = this;

      //Fetch initial data
      //this.fetch();


    };

    ctor.prototype.refresh = function () {
      this.pagingHistory = [''];
      this.page(1);
      this.fetch();
    };

    ctor.prototype.key = function () {
      var path = this.webUrl.replace(/^\/+|\/+$/g, '');
      return '/' + path.toLowerCase() + '/' + this.listName.toLowerCase();
    };

    ctor.prototype.fetch = function () {
      var self = this;
      self.isFetching(true);
      spdata.getListItems(spdata.getListItemsOptions(this), this.model.listInfo.SPXmlToJsonMap).then(function (json) {

        //ko observables
        self.listItems(json.data);
        self.ListItemCollectionPositionNext(json.ListItemCollectionPositionNext);
        self.itemCount(json.ItemCount);

        self.pagingHistory.push(json.ListItemCollectionPositionNext);

        self.isFetching(false);
      });
    };

    ctor.prototype.next = function () {
      if (this.ListItemCollectionPositionNext() === '') {
        return false;
      }
      this.page(this.page() + 1);
      this.fetch();
    };

    ctor.prototype.previous = function () {
      var spliceValue = 0;

      if (this.pagingHistory.length < 3) {
        return false;
      }

      this.page(this.page() - 1);

      // GetListItems method calculates ListItemPositionNext on each request, so we remove entries from pagingHistory
      spliceValue = (this.page() - this.pagingHistory.length);
      this.pagingHistory.splice(spliceValue);

      this.fetch();
    };

    ctor.prototype.sort = function (options) {
      var self = this;
      var sortArray = [];

      // If called empty return current sort as JSON
      if (!options) {
        return ko.toJSON(self._sort);
      }
      
      //wrap single objects as array
      options = $.isArray(options) ? options : [options];

      resetColumns();

      $.each(options, function (idx, obj) {
        var sort = new Sort(obj);

        setColumn(obj);
      
        // Setting up change event
        $.each(['field', 'dir'], function (idx, obj) {
          sort[obj].subscribe(function (val) {
            self.sort(ko.toJS(self._sort));
          });
        });

        sortArray.push(sort);
      });

      this._sort(sortArray);

      // internal
      function resetColumns() {
        // Setting sorted to false for all columns
        $.each(self.columns, function (idx, obj) {
          obj.sorted(false);
          obj.sortAsc(false);
        });
      }

      function setColumn(obj) {
        // Check if there's a self.columns with sort field
        $.grep(self.columns, function (e) {
          if (e.field === obj.field) {
            e.sorted(true);
            e.sortAsc((obj.dir === 'asc'));
          };
        });
      }
    };

    // Durandal viewmodel functions

    //ctor.prototype.activate = function () {

    //};

    
    return ctor;

  });
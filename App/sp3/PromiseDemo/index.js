/*!
* Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
/*global define, ko, L_Menu_BaseUrl*/
define(['durandal/viewModel', 'durandal/plugins/router', 'services/logger', 'services/spdata'],
  function (viewModel, router, logger, spdata) {

    
    var webUrl = ko.observable();
    var lists = ko.observableArray([]);
    var listInfo = {};

    var columnLength = ko.observable(3);
   
    
    var activate = function () {
      var self = this;
      var webUrl = L_Menu_BaseUrl;

      self.webUrl(webUrl);

      logger.log('Activatíng List View', null, 'list', true);

      return $.when(spdata.getListCollection({ webUrl: webUrl })).then(function (result) {

        // Access to detail list information through listInfo[listName]
        self.listInfo = result;
        self.lists(createListVMs(result));

        return true;
      });
    };

    var gotoDetails = function (selectedList) {
      if (selectedList) {
        var url = '#/lists/' + selectedList.listName;
        router.navigateTo(url);
      }
    };

    var viewAttached = function (view) {
      bindEventToList(view, '.list-brief', gotoDetails);
    };

    var bindEventToList = function (rootSelector, selector, callback, eventName) {
      var eName = eventName || 'click';
      $(rootSelector).on(eName, selector, function () {
        var list = ko.dataFor(this);
        callback(list);
        return false;
      });
    };

    var vm =  {
      title: 'Promises demo',
      webUrl: webUrl,
      lists: lists,
      activate: activate,
      viewAttached: viewAttached,
      activeList: viewModel.activator().forItems(lists),
      columnLength: columnLength
    };

    // thanks to Ryan Niemeyer http://jsfiddle.net/rniemeyer/EdXA2/
    vm.rows = ko.computed(function () {
      var result = [];
      var row;
      var colLength = parseInt(this.columnLength(), 10);

      //loop through items and push each item to a row array that gets pushed to the final result
      for (var i = 0, j = this.lists().length; i < j; i++) {
        if (i % colLength === 0) {
          if (row) {
            result.push(row);
          }
          row = [];
        }
        row.push(this.lists()[i]);
      }

      //push the final row  
      if (row) {
        result.push(row);
      }

      return result;

    }, vm);

    vm.colClass = ko.computed(function () {
      var gridSize = 12;
      var colLength = parseInt(this.columnLength(), 10);
    
      // Return spanXX for supported colLength
      if (gridSize % colLength === 0) {
        return 'span' + gridSize / colLength;
      }

      return 'alert-error';
    }, vm);

    vm.counterClass = function () {
      
      // Randomize counter badge class
      var badges = ['', '', '', '', 'success', 'warning', 'important', 'info', 'inverse'];
      var random = badges[Math.ceil(Math.random() * badges.length) - 1];
      return (random !== '') ? 'badge-' + random : '';
    };

    return vm;

    //#region Internal Methods


    function createListVMs(getListCollectionJsonResult) {
      var Lists = [];

      $.each(getListCollectionJsonResult, function (key, obj) {
        if (!obj.Hidden) {
          Lists.push({
            webUrl: obj.WebFullUrl,
            listName: obj.Title,
            // getListCollection isn't a 100% match of getList
            // By storing it here we have acces to it even before the getList Promise is resolved
            _listInfo: obj
          });
        }
      });
      
      return Lists;
    }
    
    //#endregion
  });
/*!
* Copyright 2011-2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
/*global define, sp3 */
define(['./logger'],
    function (logger) {

      var getListCollection = function (options) {
        if (sp3.webs[options.webUrl]) {
          logger.log('cached ListCollection', sp3.webs[options.webUrl], 'spdata.getListCollection()', true);

          return sp3.webs[options.webUrl];
        }

        var getListCollectionPromise = $().SPServices({
          operation: "GetListCollection",
          webURL: options.webUrl
        });

        return $.when(getListCollectionPromise)
          .then(function (data) {
            logger.logSuccess('resolve getListCollectionPromise', mapGetListCollection2Json(data), 'spdata.getListCollection', true);

            // Store for caching purposes
            sp3.webs[options.webUrl] = mapGetListCollection2Json(data);

            return sp3.webs[options.webUrl];
          })
          .fail(function (data) {
            logger.logError('Error', data, 'spdata.getListCollection()', true);
          });
      };

      var getModel = function (options) {

        // Return cached result if available
        if (sp3.models[options.key]) {
          logger.log('cached model', sp3.models[options.key], 'spdata.getModel()', true);

          return sp3.models[options.key];
        }

        var getListPromise = $().SPServices({
          operation: "GetList",
          listName: options.listName,
          webURL: options.webUrl
        });

        return $.when(getListPromise)
          .then(function (data) {
            logger.logSuccess('resolve getListPromise', mapGetListResult2Json(data), 'spdata.getModel()', true);

            return mapGetListResult2Json(data);
          })
          .fail(function (data) {
            logger.logError('Error', data, 'spdata.getModel()', true);
          });
      };

      var getListItems = function (options, SPXmlToJsonMap) {
        var getListItemsPromise = $().SPServices(options);
        SPXmlToJsonMap = SPXmlToJsonMap || {};

        // GetListItems using SPXmlToJsonMap if available
        return $.when(getListItemsPromise)
          .then(function (data) {
            var $data = $(data);
            var json = {
              ItemCount: parseInt($data.SPFilterNode("rs:data").attr('ItemCount'), 10) || 0,
              ListItemCollectionPositionNext: $data.SPFilterNode("rs:data").attr('ListItemCollectionPositionNext') || '',
              data: $data.SPFilterNode("z:row").SPXmlToJson({
                mapping: SPXmlToJsonMap,
                includeAllAttrs: true,
                removeOws: false
              })
            };

            logger.logSuccess('resolve getListItemsPromise', json, 'spdata.getListItems()', true);

            return json;
          })
          .fail(function (data) {
            logger.logError('Error', data, 'spdata.getListItems()', true);
          });
      };

      var getListItemsOptions = function (options) {
        var CAMLQueryOptions = createQueryOptions({
          page: options.page(),
          pagingHistory: options.pagingHistory,
          baseType: parseInt(options.baseType, 10)
        });

        var CAMLQuery = createCAMLQuery({
          sortExpression: options._sort()
        });

        var CAMLViewFields = createCAMLViewFields({
          viewFields: options.viewFields
        });

        return {
          operation: "GetListItems",
          async: false,
          webURL: options.webUrl,
          listName: options.listName,
          CAMLQuery: CAMLQuery,
          CAMLRowLimit: options._pageSize(),
          CAMLViewFields: CAMLViewFields,
          CAMLQueryOptions: CAMLQueryOptions
        };
      };


      return {
        getListCollection: getListCollection,
        getListItems: getListItems,
        getListItemsOptions: getListItemsOptions,
        getModel: getModel
      };

      //#region Internal Methods


      function createCAMLViewFields(options) {
        var result = [];
        var viewFields = options.viewFields || ['Title'];

        result.push('<ViewFields>');

        $.each(viewFields, function (idx, field) {
          result.push('<FieldRef Name="');
          result.push(field);
          result.push('" />');
        });

        result.push('</ViewFields>');

        return result.join('');
      }

      function createCAMLQuery(options) {
        var query = [];

        query.push('<Query>');
        // sorting
        if (options.sortExpression.length > 0) {
          query.push('<OrderBy>');

          // create Caml sort expression
          $.each(options.sortExpression, function (index, sortObj) {
            sortDir = (sortObj.dir() === 'asc');
            query.push('<FieldRef Name="' + sortObj.field() + '" Ascending="' + sortDir + '"/>');
          });
          query.push('</OrderBy>');
        }
        // Todo filtering
        query.push('</Query>');

        return query.join('');

      }

      function createQueryOptions(options) {
        var PID = '';
        var queryOptions = [];

        // Todo: expose other QueryOptions 
        queryOptions.push('<QueryOptions>');
        queryOptions.push('<DateInUtc>False</DateInUtc>');
        queryOptions.push('<ExpandUserField>True</ExpandUserField>');

        if (options.baseType === 1) {
          queryOptions.push('<ViewAttributes Scope="Recursive" />');
        }

        if (options.page > 1) {
          PID = options.pagingHistory[options.page - 1].replace(/&/g, '&amp;');
        }

        queryOptions.push('<Paging ListItemCollectionPositionNext="' + PID + '"/>');
        queryOptions.push('</QueryOptions>');

        return queryOptions.join('');
      }

      function mapGetListCollection2Json(data) {
        var store = {};
        $(data).SPFilterNode('List').each(function (idx, obj) {
          var propStore = {};
          var storeID;

          // See http://stackoverflow.com/questions/828311/how-to-iterate-through-all-attributes-in-an-html-element
          for (var i = 0; i < obj.attributes.length; i++) {
            var attrib = obj.attributes[i];

            if (attrib.specified) {

              if (attrib.name === 'Title') {

                storeID = attrib.value.toLowerCase();
              }

              // mapping of text values that are stored as mixed case TRUE false
              if (attrib.value.toLowerCase() === 'false') {
                propStore[attrib.name] = false;
              }
              else if (attrib.value.toLowerCase() === 'true') {
                propStore[attrib.name] = true;
              }
              else {
                propStore[attrib.name] = attrib.value;
              }
            }
          }
          storeID = (propStore.WebFullUrl + '/' + storeID).toLowerCase();
          store[storeID] = propStore;
        });

        return store;
      }

      function mapGetListResult2Json(data, Xml2JsonMap) {
        var listInfo = {};
        var SPXmlToJsonMap = listInfo.SPXmlToJsonMap = {};
        var storeKey;

        // Xml2JsonMap configuration
        // Filternode: XML element used as filter
        // PropertyID: XML attribute used as property. false store properties on root object 
        Xml2JsonMap = Xml2JsonMap || {
          fields: { FilterNode: 'Field', PropertyID: 'StaticName' },
          info: { FilterNode: 'List', PropertyID: false }
        };

        $.each(Xml2JsonMap, function (key, val) {
          var store = listInfo[key] = {};

          $(data).SPFilterNode(val.FilterNode).each(function (idx, obj) {
            var propStore = {};
            var storeID;

            // See http://stackoverflow.com/questions/828311/how-to-iterate-through-all-attributes-in-an-html-element
            for (var i = 0; i < obj.attributes.length; i++) {
              var attrib = obj.attributes[i];

              if (attrib.specified) {

                if (attrib.name === val.PropertyID) {
                  storeID = attrib.value;
                  store[storeID] = {};
                }

                // mapping of text values that are stored as mixed case TRUE false
                if (attrib.value.toLowerCase() === 'false') {
                  propStore[attrib.name] = false;
                }
                else if (attrib.value.toLowerCase() === 'true') {
                  propStore[attrib.name] = true;
                }
                else {
                  propStore[attrib.name] = attrib.value;
                }
              }
            }

            if (val.PropertyID && storeID) {
              store[storeID] = propStore;
            }
            else if (!val.PropertyID) {
              listInfo[key] = propStore;
            }
          });
        });

        // storeKey match logic of ctor.prototype.key = function () {...

        storeKey = (listInfo.info.WebFullUrl + '/' + listInfo.info.Title).toLowerCase();

        // Store cached result in global sp3.models using storeKey
        sp3.models[storeKey] = listInfo;

        // Add SPXmlToJson mapping      
        $.each(listInfo.fields, function (name, properties) {
          SPXmlToJsonMap['ows_' + name] = {
            mappedName: name,
            objectType: properties.Type
          };
        });

        return listInfo;
      }


      //#endregion
    });
/*global define */
define(['services/formatter'],
  function (formatter) {

    // columnsPerServerTemplate will be checked before columnsPerBaseType
    //http://msdn.microsoft.com/en-us/library/hh658949(v=office.12).aspx
    var columnsPerServerTemplate = {
      107: [
       { field: "ID", title: "ID", width: 80 },
       { field: "Title", title: "Title", width: '20%' },
       { field: "Status", title: "Status", width: '15%' },
       { field: "Priority", title: "Priority", width: '15%' },
       { field: "Modified", title: "Modified", template: formatter.date, args: 'yyyy/MM/dd HH:mm' },
       { field: "Editor", title: "Editor", width: '20%', template: formatter.userName }
      ]
    };

    //http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.client.basetype(v=office.12).aspx
    var columnsPerBaseType = {
      // Generic List
      0: [
        { field: "ID", title: "ID", width: 80 },
        { field: "Title", title: "Title", width: '15%' },
       { field: "Modified", title: "Modified", template: formatter.date },
        { field: "Editor", title: "Editor", template: formatter.userName }
      ],
      // Document Library
      1: [
       { field: "ID", title: "ID", width: 80 },
       { field: "FileLeafRef", title: "Name", template: formatter.fileName },
       { field: "Modified", title: "Modified" },
       { field: "Editor", title: "Editor", template: formatter.userName }
      ],
      // Discussion Board
      3: [
       { field: "ID", title: "ID", width: 80 },
       { field: "Title", title: "Title", width: '15%' },
       { field: "Modified", title: "Modified" },
       { field: "Editor", title: "Editor", width: '20%', template: formatter.userName }
      ],
      // Survey
      4: [
       { field: "ID", title: "ID", width: 80 },
       { field: "Title", title: "Title", width: '15%' },
       { field: "Modified", title: "Modified" },
       { field: "Editor", title: "Editor", width: '20%', template: formatter.userName }
      ],
      //Issue
      5: [
        { field: "ID", title: "ID", width: 80 },
        { field: "Title", title: "Title", width: '15%' },
       { field: "Modified", title: "Modified" },
       { field: "Editor", title: "Editor", width: '20%', template: formatter.userName }
      ]
    };


    return {
      pageSize: 10,
      sort: [{ field: 'ID', dir: 'asc' }],
      viewFields: ['Title'],

      columnsPerBaseType: columnsPerBaseType,
      columnsPerServerTemplate: columnsPerServerTemplate
    };



  });

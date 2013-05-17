/*global define */
define(function () {

  var sp3 = window.sp3 = window.sp3 || {
    models: {},
    webs: {},
    dataSources: {},
    VERSION: '0.3.0'
  };

  var routes = [{
    url: 'home',
    moduleId: 'viewmodels/home',
    name: 'Home',
    visible: true,
    caption: '<i class="icon-book"></i> Home'
  }, {
    url: 'lists',
    moduleId: 'sp3/PromiseDemo/index',
    name: 'Lists',
    visible: true,
    caption: '<i class="icon-user"></i> Lists'
  }, {
    url: 'lists/:id',
    moduleId: 'sp3/ListDetail/index',
    name: 'List Detail',
    visible: false
  }];

  return {
    sp3: sp3,
    routes: routes
  };
});

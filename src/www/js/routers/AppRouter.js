app.routers.AppRouter = Backbone.Router.extend({

  routes: {
    "":           "loadScreen",
    "home":       "home",
    "map":       "map"
  },

  initialize: function () {
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {

      options.crossDomain ={
        crossDomain: true
      };
      /*options.xhrFields = {
        withCredentials: true
      };*/
    });

  },

  loadScreen: function() {
    app.loadView = new app.views.LoadView();
    app.loadView.render();
  },

  home: function () {
    // Since the home view never changes, we instantiate it and render it only once
    if (!app.homeView) {
      app.homeView = new app.views.HomeView();
      app.homeView.render();
    } else {
      app.homeView.delegateEvents(); // delegate events when the view is recycled
    }
  },

  map: function(){
    app.mapView = new app.views.MapView();
    app.mapView.render();
  },

  start: function() {
    $.support.cors = true;
    Backbone.history.start();
  }
});
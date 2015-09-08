app.routers.AppRouter = Backbone.Router.extend({

  routes: {
    "":           "home",
    "home":       "home",
    "map":        "map",
    "about":      "about",
    "register":   "register",
    "login":      "login",
    "planet/:id": "planet"
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
    if (app.homeView) {
      app.homeView.render();
    } else {
      app.homeView = new app.views.HomeView();
      app.homeView.render();
    }
  },

  map: function(){
    app.mapView = new app.views.MapView();
    app.mapView.render();
  },

  planet: function(id){
    console.log(app.collections.galaxyMapPlanets.get(id));
    app.planetView = new app.views.PlanetView({planet: app.collections.galaxyMapPlanets.get(id)});
    app.planetView.render();
  },

  about: function(){
    if(app.aboutView){
      //reuse
      app.aboutView.render();
    }else {
      app.aboutView = new app.views.AboutView();
      app.aboutView.render();
    }
  },

  register: function(){
    if(app.registerView){
      //reuse
      app.registerView.render();
    }else {
      app.registerView = new app.views.RegisterView();
      app.registerView.render();
    }
  },

  login: function(){
    if(app.loginView){
      //reuse
      app.loginView.render();
    }else {
      app.loginView = new app.views.LoginView();
      app.loginView.render();
    }
  },

  start: function() {
    $.support.cors = true;
    Backbone.history.start();
  }
});
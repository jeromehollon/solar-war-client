var app = {
  views: {},
  models: {},
  routers: {},
  utils: {},
  adapters: {}
};

$(document).on("ready", function () {
  console.log("Ready. Launching app.");
  //app.router = new app.routers.AppRouter();
  /*app.utils.templates.load(["HomeView", "MapView"],
    function () {
      app.router = new app.routers.AppRouter();
      Backbone.history.start();
      console.log("We've started");
    });*/

  //Backbone.history.start();
  console.log("We've started");

  var galaxies = new app.models.GalaxyCollection().fetch()
    .done(function(data){
      console.log(data);
    });
  console.log(galaxies);

  console.log("We're doomed!");
});
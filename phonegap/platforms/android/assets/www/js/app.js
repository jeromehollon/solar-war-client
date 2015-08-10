var app = {
  views: {},
  models: {},
  routers: {},
  utils: {},
  adapters: {},
  version: "0.0.1"
};

$(document).on("ready", function () {
  var loaditems = [
    "HomeView",
    "MapView",
    "AboutView",
    "RegisterView"
  ];

  var deferreds = [];

  $.each(loaditems, function(index, view) {
    if (app.views[view]) {
      deferreds.push($.get('tpl/' + view + '.html', function(data) {
        app.views[view].prototype.template = _.template(data);
      }, 'html'));
    } else {
      console.log(view + " not found");
    }
  });

  app.linkClick = function(event){
    event.preventDefault();

    var href = $(event.currentTarget).attr('href');
    app.router.navigate(href, true);
  }

  $.when.apply(null, deferreds).done(function(){
    app.router = new app.routers.AppRouter();
    app.router.start();
    app.router.navigate("home", true);
  });
});
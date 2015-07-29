var app = {
  views: {},
  models: {},
  routers: {},
  utils: {},
  adapters: {}
};

$(document).on("ready", function () {
  app.router = new app.routers.AppRouter();
  app.router.start();


  var loaditems = [
    "HomeView",
    "MapView",
  ];

  var deferreds = [];

  $.each(loaditems, function(index, view) {
    if (app.views[view]) {
      deferreds.push($.get('tpl/' + view + '.html', function(data) {
        console.log("%s: %s", view, data);
        app.views[view].prototype.template = _.template(data);
      }, 'html'));
    } else {
      console.log(view + " not found");
    }
  });

  $.when.apply(null, deferreds).done(function(){
    console.log("Fully loaded views.");
    //app.router.navigate("map", true);
  });

  $("a").on("click", function(e){
    e.preventDefault();

    var href = $(event.currentTarget).attr('href');
    app.router.navigate(href, true);
  });
});
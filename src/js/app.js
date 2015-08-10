var app = {
  views: {},
  models: {},
  routers: {},
  utils: {},
  adapters: {},
  version: "0.0.1",
  baseUrl: "http://192.168.1.140:8080/"
};

$(document).on("ready", function () {
  var loaditems = [
    "HomeView",
    "MapView",
    "AboutView",
    "RegisterView",
    "LoginView",
  ];

  var deferreds = [];

  $.ajaxSetup({
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json; charset=UTF-8",
    dataType: "json"
  });

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
  });
});
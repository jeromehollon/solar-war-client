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
  app.linkClick = function(event){
    event.preventDefault();

    var href = $(event.currentTarget).attr('href');
    app.router.navigate(href, true);
  };

  $.ajaxSetup({
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    contentType: "application/json; charset=UTF-8",
    dataType: "json"
  });

  $.ajax({
    type: 'GET',
    url: "tpl/app-templates.js",
    dataType: 'text',
    crossDomain: false
  })
    .done(function(templates){
      $("body").append(templates);

      app.router = new app.routers.AppRouter();
      app.router.start();
    })
    .fail(function(error){
      console.log(error.statusCode());
    });

});
app.models.Planet = Backbone.Model.extend({
  urlRoot: app.baseUrl + "api/planet",

  initialize:function () {
  }

});

app.models.PlanetCollection = Backbone.Collection.extend({
  model: app.models.Planet,
  url: app.baseUrl + "api/planet",

  initialize: function(){
  }
});
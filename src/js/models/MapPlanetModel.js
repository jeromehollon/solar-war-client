app.models.MapPlanet = Backbone.Model.extend({
  defaults: {
    type: "planet",
    decorated: false
  },

  initialize:function () {
  }
});

app.models.MapPlanetCollection = Backbone.Collection.extend({
  model: app.models.MapPlanet,

  initialize: function(){
  }
});
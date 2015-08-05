app.models.Planet = Backbone.Model.extend({
  defaults: {
    type: "planet",
    decorated: false
  },

  initialize:function () {
  }
});

app.models.PlanetCollection = Backbone.Collection.extend({
  model: app.models.Planet,

  initialize: function(){
  }
});
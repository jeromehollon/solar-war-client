app.models.Planet = Backbone.Model.extend({

  initialize:function () {
  }
});

app.models.PlanetCollection = Backbone.Collection.extend({
  model: app.models.Planet,

  initialize: function(){
  }
});
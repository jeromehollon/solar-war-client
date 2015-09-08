app.models.MapStar = Backbone.Model.extend({
  defaults: {
    type: "star",
    decorated: false
  },

  initialize:function () {
  }

});

app.models.MapStarCollection = Backbone.Collection.extend({
  model: app.models.MapStar,

  initialize: function(){
  }
});
app.models.Star = Backbone.Model.extend({
  defaults: {
    type: "star",
    decorated: false
  },

  initialize:function () {
  }

});

app.models.StarCollection = Backbone.Collection.extend({
  model: app.models.Star,

  initialize: function(){
  }
});
app.models.Star = Backbone.Model.extend({

  initialize:function () {
  }

});

app.models.StarCollection = Backbone.Collection.extend({
  model: app.models.Star,

  initialize: function(){
  }
});
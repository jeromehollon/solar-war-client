app.models.Player = Backbone.Model.extend({

  initialize:function () {
  }

});

app.models.PlayerCollection = Backbone.Collection.extend({
  model: app.models.Player,
  url: app.baseUrl + "api/player",

  initialize: function(){
  }
});
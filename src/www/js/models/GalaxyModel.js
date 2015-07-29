app.models.Galaxy = Backbone.Model.extend({

  initialize:function () {
  }

});

app.models.GalaxyCollection = Backbone.Collection.extend({
  model: app.models.Galaxy,
  url: "http://localhost:8080/map/all",


  initialize: function(){
    this.fetch({
      success: this.fetchSuccess,
      error: this.fetchError
    });
  },

  fetchSuccess: function (collection, response) {
    console.log('Collection fetch success', response);
    console.log('Collection models: ', collection.models);
  },

  fetchError: function (collection, response) {
    console.log("FetchError: ");
    console.log(JSON.stringify(response));
    throw new Error("Galaxy fetch error");
  }
});
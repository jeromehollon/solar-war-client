app.models.Galaxy = Backbone.Model.extend({

  initialize:function () {
  }

});

app.models.GalaxyCollection = Backbone.Collection.extend({
  model: app.models.Galaxy,
  url: "http://192.168.1.140:8080/api/map/all",


  initialize: function(){
    _(this).bindAll("fetchSuccess");
    this.starCollection = new app.models.StarCollection();
    this.planetCollection = new app.models.StarCollection();

    this.fetch({
      success: this.fetchSuccess,
      error: this.fetchError
    });
  },

  fetchSuccess: function(collection, response) {
    var stars = collection.models[0].attributes.stars;
    var planets = collection.models[0].attributes.planets;

    var starModels = [];
    _.each(stars, function(star){
      starModels.push(new app.models.Star(star));
    });
    var planetModels = [];
    _.each(planets, function(planet){
      planetModels.push(new app.models.Planet(planet));
    });

    collection.starCollection.set(starModels);
    collection.planetCollection.set(planetModels);
  },

  fetchError: function (collection, response) {
    console.log("FetchError: ");
    console.log(JSON.stringify(response));
    throw new Error("Galaxy fetch error");
  }
});
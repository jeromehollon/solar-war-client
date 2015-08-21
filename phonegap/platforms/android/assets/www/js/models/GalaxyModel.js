app.models.Galaxy = Backbone.Model.extend({

  initialize:function () {
  }

});

app.models.GalaxyCollection = Backbone.Collection.extend({
  model: app.models.Galaxy,
  url: app.baseUrl + "api/map/all",

  customFetchSuccess: null,
  customFetchFailure: null,


  initialize: function(){
    _(this).bindAll("fetchSuccess", "fetchError", "fetch");
    this.starCollection = new app.models.StarCollection();
    this.planetCollection = new app.models.StarCollection();
  },

  fetch: function(options) {
    if(options.success){
      this.customFetchSuccess = options.success;
    }
    if(options.error){
      this.customFetchFailure = options.error;
    }

    options.success = this.fetchSuccess;
    options.error = this.fetchError;

    //call backbone's default fetch
    return Backbone.Collection.prototype.fetch.call(this, options);
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


    if(this.customFetchSuccess){
      this.customFetchSuccess(collection, response);
      this.customFetchSuccess = null;
    }
  },

  fetchError: function (collection, response) {
    if(this.customFetchFailure){
      this.customFetchFailure(collection, response);
      this.customFetchFailure = null;
    }
  }
});
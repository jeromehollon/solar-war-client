
app.views.MapView = Backbone.View.extend({
  el: "#container",

  initialize: function() {
    _(this).bindAll("render", "starClick", "planetClick");

    this.collection = new app.models.GalaxyCollection();

    this.collection.bind("reset", this.render);
    this.collection.fetch({reset: true});
  },

  render: function () {
    if(!this.collection.models[0]) {
      //we've not loaded yet, so just wait
      return this;
    }

    this.stars = this.collection.starCollection.models;
    this.planets = this.collection.planetCollection.models;


    this.$el.html(this.template({
      stars: this.collection.starCollection,
      planets: this.collection.planetCollection
    }));

    $("#galaxy-map").on("mousedown", this.mousedown);
    $("#galaxy-map").on("mouseup", this.mouseup);
    $("#galaxy-map").on("mousemove", this.mousemove);

    this.renderStars();

    $(this.$el).on("click", this.click);
    $(".star").on("click", this.starClick);
    $(".planet").on("click", this.planetClick);

    return this;
  },

  events: {
    "reset": "render"
  },

  click: function(event){
    $(".planet.active").removeClass("active");
  },

  starClick: function(event){
    var star = this.collection.starCollection.findWhere({
      id: $(event.currentTarget).data("id")
    });
    console.log("Clicked on:")
    console.log(star.get("name"));
  },
  planetClick: function(event){
    var planet = this.collection.planetCollection.findWhere({
      id: $(event.currentTarget).data("id")
    });

    $(".planet.active").removeClass("active");
    $("#planet-" + planet.id).addClass("active");

    event.stopPropagation();
  },

  // click and drag magic
  dragging: false,
  startX: 0,
  startY: 0,
  mousedown: function (event) {
    app.mapView.dragging = true;
    app.mapView.startX = event.pageX;
    app.mapView.startY = event.pageY;
  },

  mousemove: function (event) {
    if(app.mapView.dragging){
      var movementX = app.mapView.startX - event.pageX;
      var movementY = app.mapView.startY - event.pageY;
      app.mapView.startX = event.pageX;
      app.mapView.startY = event.pageY;

      var scrollTop = $("#galaxy-map").scrollTop()
      var scrollLeft = $("#galaxy-map").scrollLeft()
      $("#galaxy-map").scrollTop(scrollTop + movementY);
      $("#galaxy-map").scrollLeft(scrollLeft + movementX);
    }
  },

  mouseup: function (event) {
    app.mapView.dragging = false;
  },

  renderStars: function() {
    var minX = 0;
    var minY = 0;
    var maxX = 0;
    var maxY = 0;

    var scale = 5;

    _.each(this.stars, function(star){
      if(star.get("x") < minX) {
        minX = star.get("x");
      }

      if(star.get("y") < minY) {
        minY = star.get("y");
      }

      if(star.get("x") > maxX) {
        maxX = star.get("x");
      }

      if(star.get("y") > maxY) {
        maxY = star.get("y");
      }
    });

    //now fix their positions
    var offsetX = -minX;
    var offsetY = -minY;

    positionStar = function() {
      var x = $(this).data("x") * scale + offsetX;
      var y = $(this).data("y") * scale + offsetY;

      x = x + "px";
      y = y + "px";

      $(this).css({
        top: y,
        left: x
      });
    };

    $(".star").each(positionStar);
    $(".planet").each(positionStar);

    //Scroll to old earth
    $("#galaxy-map").scrollTop(offsetY);
    $("#galaxy-map").scrollLeft(offsetX);
  }

});
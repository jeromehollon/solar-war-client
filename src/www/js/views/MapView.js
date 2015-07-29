
app.views.MapView = Backbone.View.extend({
  el: "#container",

  initialize: function() {
    _(this).bindAll("render");


    this.starViews = [];
    this.collection = new app.models.GalaxyCollection();

    this.collection.bind("reset", this.render);
    this.collection.fetch({reset: true});
  },

  render: function () {
    if(!this.collection.models[0]) {
      //we've not loaded yet, so just wait
      return this;
    }
    this.stars = this.collection.models[0].attributes.stars;
    this.planets = this.collection.models[0].attributes.planets;


    this.$el.html(this.template({stars: this.stars, planets: this.planets}));

    $("#galaxy-map").on("mousedown", this.mousedown);
    $("#galaxy-map").on("mouseup", this.mouseup);
    $("#galaxy-map").on("mousemove", this.mousemove);

    this.renderStars();

    return this;
  },

  events: {
    "click .back-button": "back",
    "reset": "render"
  },

  back: function() {
    window.history.back();
    return false;
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
    console.log("Loaded galaxy...appending stars.");

    var minX = 0;
    var minY = 0;
    var maxX = 0;
    var maxY = 0;

    var scale = 5;

    _.each(this.stars, function(star){
      if(star.x < minX) {
        minX = star.x;
      }

      if(star.y < minY) {
        minY = star.y;
      }

      if(star.x > maxX) {
        maxX = star.x;
      }

      if(star.y > maxY) {
        maxY = star.y;
      }
    });

    //now fix their positions
    var offsetX = -minX;
    var offsetY = -minY;

    positionStar = function() {
      var x = $(this).data("x") + offsetX;
      var y = $(this).data("y") + offsetY;

      x = x * scale;
      y = y * scale;

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
    $("#galaxy-map").scrollTop(offsetY * scale);
    $("#galaxy-map").scrollLeft(offsetX * scale);
  }

});
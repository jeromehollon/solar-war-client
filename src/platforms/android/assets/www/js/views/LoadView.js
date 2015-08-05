app.views.LoadView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
    console.log("Load View");
    this.templateString = "<h1>Loading templates...</h1>";
    this.templateString += "<ul id='menu'>";
    this.templateString += "<a href='#home'><li>Home</li></a>"
    this.templateString += "<a href='#map'><li>Map</li></a>"
    this.templateString += "</ul>";
    this.templateString += "<a href='#map'>Map</a>";
  },


  render: function () {
    console.log("Rendering load view.");
    this.template = _.template(this.templateString);
    this.$el.html(this.template());

    return this;
  }
});
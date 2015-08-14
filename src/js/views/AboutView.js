app.views.AboutView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
    this.template = Handlebars.compile($("#about-view-template").html());
  },


  render: function () {
    this.$el.html(this.template({version: app.version}));
    $("button", this.$el).on("click", app.linkClick);
    return this;
  }
});
app.views.AboutView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
  },


  render: function () {
    console.log("Rendering About View");
    this.$el.html(this.template({version: app.version}));
    $("a.btn-back", this.$el).on("click", app.linkClick);
    return this;
  }
});
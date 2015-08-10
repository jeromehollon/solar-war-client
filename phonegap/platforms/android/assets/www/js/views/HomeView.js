app.views.HomeView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
  },

  render: function () {
    this.$el.html(this.template());
    $("button", this.$el).on("click", app.linkClick);
    return this;
  }

});
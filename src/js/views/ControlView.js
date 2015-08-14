app.views.ControlView = Backbone.View.extend({
  el: "#control-center",

  collection: new app.models.PlayerCollection(),

  initialize: function () {
    this.template = Handlebars.compile($("#control-view-template").html());
    _(this).bindAll("render");

    this.collection.fetch({
      success: this.render
    });
  },


  render: function () {

    var model;
    if(this.collection.models[0]){
      model = this.collection.models[0];
    }

    this.$el.html(this.template({player: model}));

    $("button[href]", this.$el).on("click", app.linkClick);
    return this;
  }
});
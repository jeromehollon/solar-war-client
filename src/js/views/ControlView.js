app.views.ControlView = Backbone.View.extend({
  el: "#control-center",

  collection: new app.models.PlayerCollection(),

  initialize: function () {
    _(this).bindAll("render");

    this.collection.fetch({
      success: this.render
    });
  },


  render: function () {
    console.log("Rendering Control View");

    var model;
    console.log(this.collection.models);
    if(this.collection.models[0]){
      model = this.collection.models[0];
    }

    this.$el.html(this.template({player: model}));

    $("button[href]", this.$el).on("click", app.linkClick);
    return this;
  }
});
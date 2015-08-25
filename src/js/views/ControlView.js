app.views.ControlView = Backbone.View.extend({
  el: "#control-center",
  playerModel: null,

  playerCollection: new app.models.PlayerCollection(),
  planetCollection: null,  //defined on initialization
  starCollection: null, //defined on init

  initialize: function (options) {
    this.template = Handlebars.compile($("#control-view-template").html());
    _(this).bindAll("render", "targetChanged", "btnViewPlanetClick");

    this.playerCollection.fetch({
      success: this.render
    });

    this.planetCollection = options.planetCollection;
    this.starCollection = options.starCollection;
  },


  render: function () {

    if(this.playerCollection.models[0]){
      this.playerModel = this.playerCollection.models[0];
    }

    this.$el.html(this.template({player: this.playerModel, type: "eventlog"}));

    $("button[href]", this.$el).on("click", app.linkClick);
    $(this.$el).on("targetChanged", this.targetChanged)
    return this;
  },

  targetChanged: function(event, model, type) {
    event.stopImmediatePropagation();
    var url = app.baseUrl + "api/";

    switch(type){
      case "planet":
        url += "planet/" + model.get("id");
        break;
      case "star":
        url += "star/" + model.get("id");
        break;
      case "fleet":
        url += ""
        break;
      case "eventlog":
      default:
        url += "";
        break;
    }

    var updateFunc = function(data) {
      this.parent.model = data;
      this.parent.$el.html(this.parent.template({player: this.parent.playerModel, model: data, type: this.type}));

      $(".btn-view-planet", this.parent.$el).on("click", this.parent.btnViewPlanetClick);
    }

    updateFunc = _.bind(updateFunc, {
      parent: this,
      type: type
    });
    $.get(url, updateFunc);
  },

  btnViewPlanetClick : function(event){
    var view = new app.views.PlanetView({planet: this.model});
    view.render();
  }
});
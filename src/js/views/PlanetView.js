app.views.PlanetView = Backbone.View.extend({
  el: "#overlay",
  planet: null,

  initialize: function (options) {
    _(this).bindAll("render", "close", "tabClick");
    this.template = Handlebars.compile($("#planet-view-template").html());
    this.planet = options.planet;
  },


  render: function () {
    this.$el.html(this.template({model: this.planet}));
    $(this.$el).show();

    $("#btn-back", this.$el).on("click", this.close);
    $(".tabnav-tab", this.$el).on("click", this.tabClick);

    //do the progress bars
    _($(".progress-bar", this.$el)).each(function(bar){
      var progress = $(bar).data("value");
      $(bar).append("<div class='bar'>&nbsp;</div>");
      $(".bar", bar).css("width", progress + "%");

      if(progress == 0){
        $(".bar", bar).css("width", "5px");
      }
    });

    return this;
  },

  tabClick: function(event){
    if($(event.target).hasClass("selected")){
      return; //don't do anything if it's already selected
    }

    var panel = $(event.target).data("panel");
    $(".tabnav-tab.selected", this.$el).removeClass("selected");
    $(event.target).addClass("selected");

    $(".panel.active", this.$el).removeClass("active");
    $("#" + panel, this.$el).addClass("active");
  },

  close: function() {
    this.$el.html("");
    $(this.$el).hide();
  }
});
app.views.PlanetView = Backbone.View.extend({
  el: "#overlay",
  planet: null,

  initialize: function (options) {
    _(this).bindAll("render", "close", "tabClick", "editBuilds", "onSlide");
    this.template = Handlebars.compile($("#planet-view-template").html());
    this.planet = options.planet;
  },


  render: function () {
    this.$el.html(this.template({model: this.planet}));
    $(this.$el).show();

    $("#btn-back", this.$el).on("click", this.close);
    $(".tabnav-tab", this.$el).on("click", this.tabClick);
    $(".btn-builds", this.$el).on("click", this.editBuilds);

    //do the progress bars
    _($(".progress-bar", this.$el)).each(function(bar){
      var progress = $(bar).data("value");
      $(bar).append("<div class='bar'>&nbsp;</div>");
      $(".bar", bar).css("width", progress + "%");

      if(progress == 0){
        $(".bar", bar).css("width", "5px");
      }
    });

    $(".dialog", this.$el).popup({
      transition: 'all 0.3s',
      scrolllock: true,
      closeelement: '#btn-close',
      escape: false
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

  editBuilds: function(event){
    $(".dialog").popup("show");

    var sliders = $(".slider", ".dialog")
    for(var i = 0; i < sliders.length; i++) {
      $(sliders[i]).slider({
        min: 0,
        max: 100,
        value: $(sliders[i]).data("value"),
        slide: this.onSlide
      })
    }
  },

  close: function() {
    this.$el.html("");
    $(this.$el).hide();
  },

  onSlide: function(event, ui){
    console.log(ui.value);
  }


});
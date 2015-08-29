app.views.PlanetView = Backbone.View.extend({
  el: "#overlay",
  planet: null,

  initialize: function (options) {
    _(this).bindAll("render", "close", "tabClick", "editBuilds", "onSlide", "onChange", "moveClick");
    this.template = Handlebars.compile($("#planet-view-template").html());
    this.helpTabTemplate = Handlebars.compile($("#help-planet-view-template").html());
    this.planet = options.planet;
  },


  render: function () {
    var help = this.helpTabTemplate({});
    this.$el.html(this.template({model: this.planet, helpTab: help}));
    $(this.$el).show();

    $("#btn-back", this.$el).on("click", this.close);
    $(".tabnav-tab", this.$el).on("click", this.tabClick);
    $(".help-item .topic", this.$el).on("click", helpTopicClick);

    $(".btn-builds", this.$el).on("click", this.editBuilds);
    $(".btn-builds-info", this.$el).on("click", this.editBuildsInfo);
    $(".btn-move", this.$el).on("click", this.moveClick);

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
      closeelement: '.btn-close',
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
    $(".builds-dialog").popup("show");

    var sliders = $(".slider", ".dialog")
    for(var i = 0; i < sliders.length; i++) {
      var value = $(sliders[i]).val();
      var productionItem = $(sliders[i]).parent().parent();

      $(".value-holder", productionItem).html(value + "%");
    }
    $(".slider", ".dialog").on("change", this.onChange);
    $(".slider", ".dialog").on("input", this.onSlide);
    $(".btn-lock", ".dialog").on("click tap", this.onLockClick);
  },

  editBuildsInfo: function(event){
    $(".builds-info-dialog").popup("show");
    console.log($(".builds-info-dialog"));
  },

  close: function() {
    this.$el.html("");
    $(this.$el).hide();
  },

  /*
    Handles when the user let's go of the mouse.
   */
  ignoreChanges: false,
  onChange: function(event){
    event.stopImmediatePropagation();

    if(this.ignoreChanges) return;
    this.ignoreChanges = true;

    var value = parseInt($(event.currentTarget).val(),10);
    var productionItems = $(event.currentTarget).parents(".dialog");

    var disabledSliders = $("input[type=range]:disabled", productionItems);
    var enabledSliders = $("input[type=range]:enabled", productionItems).not($(event.currentTarget));

    var disabledQuantity = 0; //quantity that's locked up in disabled sliders we can't change
    for(var i = 0; i < disabledSliders .length; i++){
      disabledQuantity += parseInt($(disabledSliders [i]).val(), 10);
    }

    var enabledQuality = 0; //quantity that's in enabled sliders that are changable
    for(var i = 0; i < enabledSliders.length; i++){
      enabledQuality += parseInt($(enabledSliders[i]).val(), 10);
    }

    if(value + disabledQuantity > 100){
      $(event.currentTarget).val(100 - disabledQuantity);
      for(var i = 0; i < enabledSliders.length; i++){
        $(enabledSliders[i]).val(0);
      }

      this.updateAllSliders(productionItems);
      this.ignoreChanges = false;
      return;
    }

    var changePerSlideAbsolute = (100 - (value + enabledQuality)) / enabledSliders.length;
    var changePerSlide = Math.floor(changePerSlideAbsolute);
    var changePerSlideRemainder = (100 - (value + enabledQuality + changePerSlide * enabledSliders.length));
    if(changePerSlide >= 0){
      for(var i = 0; i < enabledSliders.length; i++){
        var newVal = parseInt($(enabledSliders[i]).val(),10) + changePerSlide;
        if(changePerSlideRemainder > 0){
          newVal++;
          changePerSlideRemainder--;
        }
        if(changePerSlideRemainder > 0){
          newVal--;
          changePerSlideRemainder++;
        }
        $(enabledSliders[i]).val(newVal);
      }
    }else {
      //we gotta decrease
      do {
        var movableSliders = this.nonZero($("input[type=range]:enabled", productionItems).not(event.currentTarget));
        var movableValue = 0;
        for (var i = 0; i < movableSliders.length; i++) {
          movableValue += parseInt($(movableSliders[i]).val(), 10);
        }

        changePerSlideAbsolute = Math.floor((100 - (value + movableValue)) / movableSliders.length);
        changePerSlide = Math.floor(changePerSlideAbsolute);
        changePerSlideRemainder = (100 - (value + movableValue + changePerSlide * movableSliders.length));


        for (var i = 0; i < movableSliders.length; i++) {
          var newVal = parseInt($(movableSliders[i]).val(), 10) + changePerSlide;

          if(changePerSlideRemainder > 0){
            newVal++;
            changePerSlideRemainder--;
          }
          if(changePerSlideRemainder > 0){
            newVal--;
            changePerSlideRemainder++;
          }

          $(movableSliders[i]).val(newVal);
        }

      } while (changePerSlide < 0);
    }

    this.updateAllSliders(productionItems);

    this.ignoreChanges = false;
  },

  /*
    Handles when the user moves, but hasn't always let go yet.
   */
  onSlide: function(event){
    var value = $(event.currentTarget).val();
    var productionItem = $(event.currentTarget).parents(".production-item");

    $(".value-holder", productionItem).html(value + "%");
  },

  onLockClick: function(event) {
    var state = $("span", event.currentTarget).html();
    var parent = $(event.currentTarget).parents(".production-item");

    if(state == "lock"){
      $("span", event.currentTarget).html("unlock");
      $("input[type=range]", parent).removeAttr('disabled');
    }else{
      $("span", event.currentTarget).html("lock");
      $("input[type=range]", parent).attr('disabled','disabled');
      console.log($("input[type=range]", parent));
    }
  },

  nonZero: function(elements) {
    var nonzeros = [];
    for(var i = 0; i < elements.length; i++){
      if(parseInt($(elements[i]).val(),10) != 0){
        nonzeros.push(elements[i]);
      }
    }
    return nonzeros;
  },
  updateAllSliders: function(productionItems) {
    var allSliders = $("input[type=range]", productionItems);
    var totalValue = 0;
    for(var i = 0; i < allSliders.length; i++){

      var value = parseInt($(allSliders[i]).val(), 10);
      var productionItem = $(allSliders[i]).parents(".production-item");

      $(".value-holder", productionItem).html(value + "%");

      totalValue += parseInt($(allSliders[i]).val(), 10);
    }
    $("#remaining-build-points").html(100-totalValue);
  },

  moveClick: function(event){
    
  }
});
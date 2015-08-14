app.views.HomeView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
    _(this).bindAll("attemptAuth");
    this.template = Handlebars.compile($("#home-view-template").html());
  },

  render: function () {
    this.$el.html(this.template());

    $("button", this.$el).on("click", app.linkClick);


    if(app.utils.AuthUtil.isStored){
      this.attemptAuth();
    }

    return this;
  },

  attemptAuth: function(){
    var authVars = app.utils.AuthUtil.getAuth();

    $("#statusText", this.$el).text("Attempting to login as " + authVars.username + "...");
    $("#btn-login", this.$el).attr("disabled", "disabled");
    $("#btn-register", this.$el).attr("disabled", "disabled");

    app.utils.AuthUtil.reauthentication()
      .done(function(){
        $("#btn-map", this.$el).removeAttr("disabled");
        $("#statusText", this.$el).text("Login success.").fadeOut(5000);
      })
      .fail(function(){
        $("#btn-login", this.$el).removeAttr("disabled");
        $("#btn-register", this.$el).removeAttr("disabled");
        $("#statusText", this.$el).text("Authentication expired. Please log in again.").addClass("flash-error");
      });

  }

});
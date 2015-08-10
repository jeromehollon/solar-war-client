app.views.HomeView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
    _(this).bindAll("attemptAuth");
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

    app.utils.AuthUtil.attemptAuthentication(authVars.username, authVars.password)
      .done(function(){
        $("#btn-map", this.$el).removeAttr("disabled");
        $("#statusText", this.$el).text("Login success.").fadeOut("slow");
      })
      .fail(function(){
        $("#btn-login", this.$el).removeAttr("disabled");
        $("#btn-register", this.$el).removeAttr("disabled");
        $("#statusText", this.$el).text("Login failed.");
      });

  }

});
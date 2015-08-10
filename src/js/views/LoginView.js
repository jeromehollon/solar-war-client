app.views.LoginView = Backbone.View.extend({
  el: "#container",

  initialize: function () {
    _(this).bindAll("submitClicked");
  },

  render: function () {
    this.$el.html(this.template());
    $("button[href]", this.$el).on("click", app.linkClick);
    $("#submit-button", this.$el).on("click", this.submitClicked);
    return this;
  },


  submitClicked: function (event) {
    event.preventDefault();

    var username =  $("#username", this.$el).val();
    var password = $("#password", this.$el).val();

    //throw up a wait dialog
    $("#submit-button", this.$el).attr("disabled", "disabled");
    $("#submit-button", this.$el).after('<img id="loader" src="libs/images/ajax-loader.gif" />');

    //validation passed, let's send it in
    app.utils.AuthUtil.attemptAuthentication(username, password)
      .done(function(){
        //store auth
        app.utils.AuthUtil.storeAuth(username, password);

        $("#login #loader", this.$el).remove();
        $("#login", this.$el).append(
            "<div class='flash flash-success'>" +
            "Success!" +
            "</div>"
        );
        setTimeout(function(){
          app.router.navigate("home", true);
        },500);
      })
      .fail(function(error){
        console.log(error);

        $("#submit-button", this.$el).removeAttr("disabled");
        $("#login #loader", this.$el).remove();
        $("#login .flash", this.$el).remove();
        $("#login", this.$el).append(
            "<div class='flash flash-error'>" +
            "Could not login. You may be offline, or the server could be unreachable. Please try again later." +
            "</div>"
        );
      });
  }
});

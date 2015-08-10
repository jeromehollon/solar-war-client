app.views.RegisterView = Backbone.View.extend({
  el: "#container",

  validator: [
    {
      id: "username",
      min: 5,
      max: 255,
      regex: /^[a-zA-Z0-9-_]*$/,
      regexMessage: "Can only contain alphanumeric characters and - and _."
    },
    {
      id: "password",
      min: 8,
      max: 4096
    },
    {
      id: "email",
      regex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_])*(\.[-a-z0-9_]+)*\...+?$/i,
      regexMessage: "Not a valid email address."
    }
  ],

  initialize: function () {
    _(this).bindAll("submitClicked");
  },

  render: function () {
    this.$el.html(this.template());
    $("button[href]", this.$el).on("click", app.linkClick);
    $("#submit-button", this.$el).on("click", this.submitClicked);
    return this;
  },

  submitClicked: function(event){
    event.preventDefault();
    var messages = [];
    var values = {};

    $("#registration .flash", this.$el).remove();

    for(var i = 0; i < this.validator.length; i++){
      var validation = this.validator[i];
      var value = $("#" + validation.id, this.$el).val();
      values[validation.id] = value;

      if(validation.min && value.length < validation.min){
        messages.push(
            validation.id.toProperCase() + " is too short. Must be at least " + validation.min + " characters."
        );
      }
      if(validation.max && value.length > validation.max){
        messages.push(
            validation.id.toProperCase() + " is too long. Must be at less than " + validation.max + " characters."
        );
      }
      if((validation.regex && (validation.min && value.length > 0)) && !value.match(validation.regex)){
        messages.push(
            validation.id.toProperCase() + " is invalid. " + validation.regexMessage
        )
      }
    }

    //also check that the two passwords match
    if($("#password", this.$el).val() != $("#password2", this.$el).val()){
      messages.push("Passwords do not match.");
    }

    if(messages.length > 0){
      //we got errors
      $("#registration", this.$el).append(
        "<div class='flash flash-error hidden'>" +
          messages.join("<br />") +
          "</div>"
      );
      $("#registration .flash", this.$el).fadeIn();
    }else{
      //throw up a wait dialog
      $("#submit-button", this.$el).attr("disabled", "disabled");
      $("#submit-button", this.$el).after('<img id="loader" src="libs/images/ajax-loader.gif" />');

      //validation passed, let's send it in
      var url = app.baseUrl + "api/player/register";
      $.ajax({
        method :"POST",
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        contentType: "application/json; charset=UTF-8",
        dataType: "json",
        data: JSON.stringify(values)
      })
        .done(function(){
          $("#registration #loader", this.$el).remove();
          $("#registration", this.$el).append(
              "<div class='flash flash-success'>" +
              "Success!" +
              "</div>"
          );
          setTimeout(function(){
            app.router.navigate("home", true);
          },500);
        })
        .fail(function(error){
          $("#submit-button", this.$el).removeAttr("disabled");
          $("#registration .flash", this.$el).remove();
          $("#registration #loader", this.$el).remove();

          if(error.status == 400){
            $("#registration", this.$el).append(
                "<div class='flash flash-error'>" +
                error.responseJSON.message +
                "</div>"
            );
          }else {
            $("#registration", this.$el).append(
                "<div class='flash flash-error'>" +
                "Could not register. You may be offline, or the server could be unreachable. Please try again later." +
                "</div>"
            );
          }
        });
    }
  }

});
app.utils.AuthUtil = {

  storeAuth: function(username){
    window.localStorage.setItem("username", username);
  },

  getAuth: function(){
    return {
      username: window.localStorage.getItem("username")
    }
  },

  clearAuth: function() {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
  },

  isStored: function(){
    var auth = this.getAuth();
  },

  reauthentication: function(){
    var url = app.baseUrl + "api/player/revalidate";
    return $.get(url);
  },

  attemptAuthentication: function(username, password){
    var values = {
      "username":  username,
      "password": password,
      "_spring_security_remember_me": true
    };

    var url = app.baseUrl + "login";
    return $.ajax({
      method :"POST",
      url: url,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      contentType: "application/x-www-form-urlencoded",
      dataType: "",
      //data: JSON.stringify(values)
      data: values
    })
  }
};
app.utils.AuthUtil = {

  storeAuth: function(username, password){
    window.localStorage.setItem("username", username);
    window.localStorage.setItem("password", password);
  },

  getAuth: function(){
    return {
      username: window.localStorage.getItem("username"),
      password: window.localStorage.getItem("password")
    }
  },

  clearAuth: function() {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
  },

  isStored: function(){
    var auth = this.getAuth();
  },

  attemptAuthentication: function(username, password){
    var values = {
      "username":  username,
      "password": password
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
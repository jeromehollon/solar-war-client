function helpTopicClick(event) {
  var parent = $(event.currentTarget).parents(".help-item");

  if($(parent).hasClass("active")){
    return; //already displayed
  }

  $(".help-item.active").removeClass("active")
  $(parent).addClass("active")
}
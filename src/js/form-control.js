// JavaScript for label effects only
$(window).load(function(){
  
  $("[data-form-control] input").focusout(function(){
    if($(this).val() != ""){
      $(this).addClass("has-content");
    }else{
      $(this).removeClass("has-content");
    }
  })
});

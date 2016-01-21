
function glassdoor_input_field_handling(){
  $('#company_name').on('input', function() {
    var request = "http://api.glassdoor.com/api/api.htm?"+
      "t.p=52249"+
      "&t.k=jk34H2LfjGi"+
      "&userip="+userip+//IP found from L2.io's API
      "&useragent="+String(navigator.userAgent)+
      "&format=json"+
      "&v=1"+
      "&action=employers"+
      "&q="+$(this).val();
    console.log("Glassdoor API request: "+request);


    $.ajax({
           type: "GET",
           url: request,
           async:true,
           dataType : 'jsonp',   //you may use jsonp for cross origin request
           crossDomain:true,
           success: function(data, status, xhr) {
             console.log(data);
             console.log(status);
           }
       });

  });
}



$( document ).ready(function() {
  glassdoor_input_field_handling();
});

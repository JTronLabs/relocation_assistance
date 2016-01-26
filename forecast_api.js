//API: https://developer.forecast.io/docs/v2


function forecast_api_call(place){
    var request = "https://api.forecast.io/forecast/2939c13b8f65b1892eefa9d96c60669b/"
      +place.geometry.location.lat()+","+place.geometry.location.lng();
    console.log("Forecast API request: "+request);


    $.ajax({
           type: "GET",
           url: request,
           async:true,
           dataType : 'jsonp',   //you may use jsonp for cross origin request
           crossDomain:true,
           success: function(data, status, xhr) {
             console.log(data);
             console.log(status);
             update_html_with_forecast_results(data);
           },
           error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
           }
       });
}

function update_html_with_forecast_results(data){

}

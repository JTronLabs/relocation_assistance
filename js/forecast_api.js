//API: https://developer.forecast.io/docs/v2

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var dayNames = ["Su", "M", "Tu", "W", "Th", "F",
  "Sa"
];

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
  $("#weather").empty();

  data["daily"]["data"].forEach(get_weather_html)
}

function get_weather_html(current_element,index,array){
      var today = new Date();
      today.setDate(today.getDate() + index);

      //cover special cases so the icon name will match its respective image name
      var iconName = current_element["icon"];
      if(iconName == "sleet"){
        iconName = "hail";
      }
      
      var minTmp = Math.round(current_element["temperatureMin"]);
      var maxTmp = Math.round(current_element["temperatureMax"]);
      var iconName = current_element["icon"];
      var windSpd = current_element["windSpeed"];
      var precipProbability = Math.round(current_element["precipProbability"] * 100);

      /*
      //if precip intensity is small (won't rain), don't include it
      var precipIntensity = current_element["precipIntensity"];
      var precipIntensityString =  ", "+precipIntensity+"in/hr";
      if(precipIntensity < 0.01){
        precipIntensityString = "";
      }
      */
      var precipIntensityString =  "";

      var html =
      "<div class=\"weather_item\">"
      +"    <div class=\"date\"><strong>"+dayNames[today.getDay()]+" "+monthNames[today.getMonth()]+" "+today.getDate()+", "+today.getFullYear()
      +"      </strong></div>"
      +"    <div class=\"weather_icon\">"
      +"       <img src=\"img/weather_icons/"+iconName+".svg\" alt=\"rain\" >"
      +"    </div>"
      +"    <div class=\"weather_info\">"
      +"      <span class=\"temp\">"
      +"       <img src=\"img/weather_icons/thermometer.svg\" alt=\"Thermometer\" >"
      +"       <span id=\"temp_value\">"+minTmp+" - "+maxTmp+" F</span>"
      +"      </span>"
      +"      <span class=\"wind_spd\">"
      +"       <img src=\"img/weather_icons/wind_spd.svg\" alt=\"Wind\" >"
      +"       <span id=\"wind_spd_value\">"+windSpd+" mph</span>"
      +"      </span>"
      +"      <span class=\"precip\">"
      +"       <img src=\"img/weather_icons/droplet.svg\" alt=\"Precipitation\" >"
      +"       <span id=\"precip_value\">"+precipProbability+"%"+precipIntensityString+"</span>"
      +"      </span>"
      +"    </div>"
      +"</div>";

      $("#weather").append(html);
}

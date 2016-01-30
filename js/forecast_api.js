//API: https://developer.forecast.io/docs/v2

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
  "Saturday"
];

function forecast_api_call(lat,lng){
    var request = "https://api.forecast.io/forecast/2939c13b8f65b1892eefa9d96c60669b/"
      +lat+","+lng;
    //console.log("Forecast API request: "+request);


    $.ajax({
           type: "GET",
           url: request,
           async:true,
           dataType : 'jsonp',   //you may use jsonp for cross origin request
           crossDomain:true,
           success: function(data, status, xhr) {
             //console.log(data);
             //console.log(status);
             update_html_with_forecast_results(data);
             add_forecast_api_credit();
           },
           error: function(jqXHR, textStatus, errorThrown) {
             update_html_with_forecast_results();
           }
       });
}

function update_html_with_forecast_results(data){
  $("#weather").empty();

  data = data || 0;//make data an optional parameter

  if(data == 0){
    $("#weather").append("<p>Fetching weather data failed, please try again later</p>");
  }else{
    data["daily"]["data"].forEach(get_weather_html);
  }
}

function get_weather_html(current_element,index,array){
      var today = new Date();
      today.setDate(today.getDate() + index);

      var minTmp = Math.round(current_element["temperatureMin"]);
      var maxTmp = Math.round(current_element["temperatureMax"]);
      var iconName = current_element["icon"];
      var windSpd = current_element["windSpeed"];
      var precipProbability = Math.ceil(current_element["precipProbability"] * 100);

      //cover special cases so the icon name will match its respective image name
      var iconName = current_element["icon"];
      /*
      if(precipProbability > 50){
        iconName = current_element["precipType"];
      }
      */
      if(iconName == "sleet"){
        iconName = "hail";
      }

      //:: from Forecast.io ::
      //A very rough guide is that a value of 0 in./hr. corresponds to no precipitation,
      //0.002 in./hr. corresponds to very light precipitation, 0.017 in./hr. corresponds
      //to light precipitation, 0.1 in./hr. corresponds to moderate precipitation,
      //and 0.4 in./hr. corresponds to heavy precipitation.
      var precipIntensity = current_element["precipIntensity"];
      var precipIntensityString =  "";
      if(precipIntensity < 0.002){
        precipIntensityString = "Very light";
      }else if(precipIntensity < 0.017){
        precipIntensityString = "Light";
      }else if(precipIntensity < 0.1){
        precipIntensityString = "Moderate";
      }else if(precipIntensity < 0.4){
        precipIntensityString = "Heavy";
      }else{
        precipIntensityString = "Very Heavy";
      }

      var html =
      "<div class=\"weather_item\">"
      +"    <div class=\"date\"><strong>"+dayNames[today.getDay()]+" "+monthNames[today.getMonth()]+" "+today.getDate()//+", "+today.getFullYear()*=
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
      +"       <span id=\"precip_value\">"+precipIntensityString+", "+precipProbability+"%</span>"
      +"      </span>"
      +"    </div>"
      +"</div>";

      $("#weather").append(html);
}

function add_forecast_api_credit(){
  $('#weather').append(
    "<a href=\"http://forecast.io\" class=\"api_credit\">"
    +"  <img src=\"img/forecast.io.ico\">"
    +"  More at Forecast.io"
    +"</a>"
  );
}

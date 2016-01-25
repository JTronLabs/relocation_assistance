
//API source: http://www.ncdc.noaa.gov/cdo-web/webservices/v2#gettingStarted
//Don't think this API is going to work for what I want: listing average climate over time for a given city (seasonally/monthly)

function climate_data_fetch(){
    var today = new Date();
    var request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/data?"
      +"datasetid=NORMAL_MLY"
      +"&locationid=ZIP:43210"
      +"&startdate=2010-01-01"
      +"&enddate=2010-12-01";
    console.log("NOAA Climate API request: "+request);

    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:28801&startdate=2010-05-01&enddate=2010-05-01"; //given, working request from docs
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/datasets";//view all NOAA datasets available, with a short descriptor of each
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/datacategories";//datacategories description
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/datatypes";//datatype descriptions
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/locationcategories"; //location categories
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/locations";//available locations
    //request = "http://www.ncdc.noaa.gov/cdo-web/api/v2/stations"; //all data collection stations


    $.ajax({
           type: "GET",
           headers:{ token:"lURjuelBBBDNAoMXpddPJQnpexzotaHy" },
           url: request,
           async:true,
           //dataType : 'jsonp',
           //crossDomain:true,
           success: function(data, status, xhr) {
             console.log(data);
             console.log(status);
           },
           error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR,textStatus, errorThrown);
           }
       });
}



$( document ).ready(function() {
  climate_data_fetch();
});

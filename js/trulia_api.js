//API: https://developer.forecast.io/docs/v2


function trulia_api_call(city,state){
    var today = new Date();
    var week_ago = new Date();
    week_ago.setDate(week_ago.getDate() - 7);

    var request = "http://api.trulia.com/webservices.php?"
    +"library=TruliaStats"
    +"&function=getCityStats"
    +"&city="+city
    +"&state="+state
    +"&startDate="+week_ago.getFullYear()+"-"+week_ago.getMonth()+"-"+week_ago.getDate()
    +"&endDate="+today.getFullYear()+"-"+today.getMonth()+"-"+today.getDate()
    +"&apikey=r89a7pt4yvd27r25jssbcsv2";
    console.log("Trulia API request: "+request);


    $.ajax({
           type: "GET",
           url: request,
           async:true,
           dataType : 'xml',   //you may use jsonp for cross origin request
           crossDomain:true,
           success: function(data, status, xhr) {
             console.log(data);
             console.log(status);
             update_html_with_trulia_results(data);
           },
           error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
           }
       });
}

function update_html_with_trulia_results(data){

}

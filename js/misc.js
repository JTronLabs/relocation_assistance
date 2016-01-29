

$( document ).ready(function() {
  $('#results').hide();
  $('#show_results_btn').prop('disabled', true);

  $(document).on('click', "#show_results_btn",function () {
    if(user_is_on_landing_page()){
      $('#results').show();
      $('#landing_page').hide();

      //move input from its original location (center of window) to the navbar
      var f = $('#form_inputs').detach();
      f.appendTo( $("#new_form_location") );
    }else{
      run_all_api_updates();
    }
  });

  //glassdoor_input_field_handling();
});

function user_is_on_landing_page(){
  return $("#landing_page").find( $("#form_inputs") ).length > 0;
}

function run_all_api_updates(){
  var place = autocomplete.getPlace();
  //console.log( place );
  forecast_api_call(place.geometry.location.lat(), place.geometry.location.lng());
  //meetup_groups_nearby(place.geometry.location.lat(), place.geometry.location.lng());
  meetup_stats(place.geometry.location.lat(), place.geometry.location.lng(),place["address_components"][0]["long_name"]);
  //trulia_api_call(place["address_components"][0]["long_name"], place["address_components"][2]["short_name"]);//city,state
}

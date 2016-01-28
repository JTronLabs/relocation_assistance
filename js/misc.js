

$( document ).ready(function() {
  $('#results').hide();
  $('#show_results_btn').prop('disabled', true);

  $(document).on('click', "#show_results_btn",function () {
    $('#results').show();

    //move input from its original location (center of window) to the navbar
    var f = $('#form_inputs').detach();
    f.appendTo( $("#new_form_location") );
  });

  //glassdoor_input_field_handling();
});

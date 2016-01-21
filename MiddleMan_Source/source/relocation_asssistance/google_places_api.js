//requires Google Places API to be loaded into HTML file


// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.
var autocomplete;

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('autocomplete')),
      {types: ['(cities)']}
    );

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', respondToPlaceSelection);
}


function respondToPlaceSelection() {
  console.log( autocomplete.getPlace() );
}

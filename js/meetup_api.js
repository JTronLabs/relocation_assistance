function meetup_number_users_nearby(lat,lng){
    var request = " https://api.meetup.com/2/cities/"
      +"lat="+lat
      +"&lon="+plng
      +"&radius=10"
      +"&only=member_count"
      +"&sig=28137b13a15737f5760612a7f252523";
    console.log("Meetup API request: "+request);

}

function meetup_groups_nearby(lat,lng){
  var request = "https://api.meetup.com/find/groups?"
  +"&photo-host=public"
  +"&lat="+lat
  +"&lon="+lng
  +"&order=most_active"
  +"&page=25"
  +"&only=name,link,members,group_photo.photo_link,category"
  +"&sign=true"
  +"&key=28137b13a15737f5760612a7f252523";
  //console.log("Meetup API request: "+request);


  $.ajax({
       type: "GET",
       url: request,
       async:true,
       dataType : 'jsonp',   //you may use jsonp for cross origin request
       crossDomain:true,
       success: function(data, status, xhr) {
         //console.log(data);
         $("#meetups").empty();

         if(data["data"].length > 0){
           data["data"] = data["data"].sort(sort_meetup_data);
           data["data"].forEach(append_meetup_group);
         }else{
           $("#meetups").append("<p>Fetching meetup data failed, please try again later</p>");
         }
       },
       error: function(jqXHR, textStatus, errorThrown) {

       }
   });
}

function append_meetup_group(current_element,index,array){
  var group_name = current_element["name"];
  var num_members =  current_element["members"];
  var link = current_element["link"];
  var photo_link = "img/img_missing.png"
  try{
    var photo_link = current_element["group_photo"]["photo_link"];
  }catch(err){

  }

  var html =
    "<a href=\""+link+"\" title=\""+group_name+"\" class=\"meetup_item\">"
    +"    <img src=\""+photo_link+"\" alt=\""+group_name+"\" />"
    +"    <p>"+group_name+"</p>"
    +"</a>"

  $("#meetups").append(html);
}


function sort_meetup_data(a, b){
    return (a["category"] < b["category"]) ? 1 : -1;
}

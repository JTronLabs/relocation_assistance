//https://secure.meetup.com/meetup_api/console/?path=/find/groups

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

function meetup_stats(lat,lng,city_name){
    var request = "https://api.meetup.com/find/groups?"
    +"&photo-host=public"
    +"&lat="+lat
    +"&lon="+lng
    +"&radius="+20
    +"&order=most_active"
    +"&page=300"
    +"&only=members,category.shortname"
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
           $("#num_members_bar_chart").empty();
           $("#num_groups_bar_chart").empty();

           if(data["data"].length > 0){
             var d = reorganize_data_and_find_overall_stats(data["data"]);
             create_num_members_bar_chart(d.data,d.total_num_ppl)
             create_num_groups_pie_chart(d.data, d.total_num_groups, city_name);
           }else{
             $("#meetups").append("<p>Fetching Meetup.com data failed, please try again later</p>");
           }
         },
         error: function(jqXHR, textStatus, errorThrown) {

         }
     });
}

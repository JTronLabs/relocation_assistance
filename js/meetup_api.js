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

function meetup_stats(lat,lng){
    var request = "https://api.meetup.com/find/groups?"
    +"&photo-host=public"
    +"&lat="+lat
    +"&lon="+lng
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
           if(data["data"].length > 0){
             var d = reorganize_data_to_array(data["data"]);
             create_num_members_bar_chart(d,data["data"].length)
           }else{
             $("#meetups").append("<p>Fetching Meetup.com data failed, please try again later</p>");
           }
         },
         error: function(jqXHR, textStatus, errorThrown) {

         }
     });
}

function reorganize_data_to_array(data){
  var hashed_data = {};

  for (var i = 0; i < data.length; i++) {
    var category = "None";
    try{
      category = data[i]["category"]["shortname"];
    }catch(err){
      //no category available for this meetup
    }
    var num_members_in_group = data[i]["members"];

    if(category in hashed_data){
      hashed_data[category]["num_members"] += num_members_in_group;
      hashed_data[category]["num_groups"] += 1;
    }else{
        hashed_data[category] = {
                                "num_members":num_members_in_group,
                                "num_groups":1
                              };
    }
  }

  var array_data = []
  for (var key in hashed_data) {
    var new_data_pt = {
      "name":key,
      "num_members":hashed_data[key]["num_members"],
      "num_groups":hashed_data[key]["num_groups"]};
    array_data.push(new_data_pt);
  }

  return array_data;
}


//D3 source: http://d3js.org/
/*D3 tutorial sources:
    http://bost.ocks.org/mike/bar/2/
 */
function create_num_members_bar_chart(data,total_num_groups){
  var width = 420,
      barHeight = 20;

  //creates a function that maps from data space (domain) to display/pixel space (range)
  var domain_to_display_map = d3.scale.linear()
      .domain([0,
                d3.max(data, function(d){//accessor method to find the max of "num_members in this data array"
                  return d["num_members"];
                })
              ]
            )
      .range([0, width]);

  var chart = d3.select("#num_members_bar_chart")//select HTML element
      .attr("width", width)//set width of HTML element
      .attr("height", barHeight * data.length);//height is total number of bars

  var bar = chart.selectAll("g")//prepare to create 'g' (logical svg container element) in this element (none currently there)
      .data(data)//data join
    .enter().append("g")//create a 'g' in the chart for each data element
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });//translate the g element vertically, creating a local origin for positioning the bar and its associated label.

  //exactly one rect and one text element per g element, so append directly to the bar/'g' element (rect and text inherit info from parent 'g' element)
  bar.append("rect")//svg element 'rect' created inside each 'g'
      .attr("width", function(d) { return domain_to_display_map(d.num_members) }) //scale bar from domain to pixel range
      .attr("height", barHeight - 1);//one less than potential total to create padding between bars

  bar.append("text")//text describing the bar chart must be placed explicitly
      .attr("x", function(d) { return domain_to_display_map(d.num_members) - 3; })//x offset is 3 left of the edge
      .attr("y", barHeight / 2)//approxiamtely center the text vertically
      .attr("dy", ".35em")//used to center text vertically (text is .7em)
      .text(function(d) { return d.name; });//set the 'text' element's wording to the data value
}

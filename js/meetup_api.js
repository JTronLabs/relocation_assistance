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
             var d = reorganize_data_to_array(data["data"]);
             create_num_members_bar_chart(d,data["data"].length,city_name)
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
function create_num_members_bar_chart(data,total_num_groups,city_name){
  //organize the data to be descending
  data.sort(function(a,b){
    return a["num_members"] < b["num_members"];
  });

  var margin = {top: 30, right: 5, bottom: 20, left: 80},//this acts as svg padding, and allows space for the x,y axis to be placed on the graph
      totalWid = 500,
      totalHeight = 500,
      width = totalWid - margin.left - margin.right,
      height = totalHeight - margin.top - margin.bottom;//height is total number of bars * height of each bar

  //creates a function that maps from data space (domain) to display/pixel space (range)
  var x = d3.scale.linear()
      .domain([0,
                d3.max(data, function(d){//accessor method to find the max of "num_members" in this data array
                  return d["num_members"];
                })
              ]
            )
      .range([0, width]);

  var y = d3.scale.ordinal()
    .domain(data.map(function (d) { return d.name; }))
    .rangeRoundBands([0, height]);//scales ordinal data to be equal height proportional to the total height

  //bind axis to existing x and y scales and set its position relative to graph
  var xAxis = d3.svg.axis()
    .scale(x)//tells D3 how to scale and place the tick marks
    .tickFormat(d3.format("s"))//format numbers to use K for 1000, M for 1,000,000, etc
    .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var chart = d3.select("#num_members_bar_chart")//select HTML element
      .attr("width", totalWid)//set width of outer SVG container's HTML element. Add in the margin so the enrite graphs size remains constant
      .attr("height", totalHeight)
  .append("g")//apply margins by offsetting the origin of the chart area by the top-left margin
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //add a title to the chart at the top middle
  chart.append("text")
    .attr("x", (width / 2) + margin.left)
    .attr("y", 5 - (margin.top / 2) )
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(total_num_groups+" Most Active Groups in "+city_name);

  //append x axis to the chart
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")//move axis down below the graph
    .call(xAxis);

  //append y axis to the chart
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var bar = chart.selectAll(".bar")//prepare to create 'g' (logical svg container element) in this element with class label "bar" (to allow selectAll to avoid the 2 axis).
      .data(data)//data join
    .enter().append("g")//create a 'g' in the chart for each data element
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(0," + i * y.rangeBand() + ")"; });//translate the g element vertically, creating a local origin for positioning the bar and its associated label.

  //exactly one rect and one text element per g element, so append directly to the bar/'g' element (rect and text inherit info from parent 'g' element)
  bar.append("rect")//svg element 'rect' created inside each 'g'
      .attr("width", function(d) { return x(d.num_members) }) //scale bar from domain to pixel range
      .attr("height", y.rangeBand());//one less than potential total to create padding between bars

  bar.append("text")//text describing the bar chart must be placed explicitly
      .text(function(d) { return d.num_members; })//First, set the 'text' element's wording to the data value
      .attr("x", function(d) {//set text's x position next to end of its bar
        var textPos = x(d.num_members) - 3;//text is placed inside of its bar
        var l = this.getComputedTextLength();
        if(textPos - l < x(0) + 5 ){//the text will be off the left side of the bar (into the y axis), thus it must be moved
          textPos =  x(d.num_members) + l + 3;//instead, place text to the right of its bar
        }
        return textPos;
      })
      .attr("y", y.rangeBand() / 2)//approximately center the text vertically
      .attr("dy", ".35em");//exactly center text vertically (text is .7em)

}

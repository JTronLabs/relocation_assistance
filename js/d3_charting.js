
function reorganize_data_and_find_overall_stats(data){
  var total_num_ppl = 0;

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
    total_num_ppl += num_members_in_group;
  }


  var array_data = []
  for (var key in hashed_data) {
    var new_data_pt = {
      "name":key,
      "num_members":hashed_data[key]["num_members"],
      "num_groups":hashed_data[key]["num_groups"]};
    array_data.push(new_data_pt);
  }

  return {"organized_data":array_data,"total_num_ppl":total_num_ppl,"total_num_groups":data.length};
}

//D3 source: http://d3js.org/
/*D3 tutorial sources:
    http://bost.ocks.org/mike/bar/2/
 */
function create_bar_chart(data,title_string,html_id_name,label_accessor_method,value_accessor_method){
  //organize the data to be descending with respect to it accessed value
  data.sort(function(a,b){
    return value_accessor_method(b) - value_accessor_method(a);
  });

  var margin = {top: 30, right: 5, bottom: 20, left: 80},//this acts as svg padding, and allows space for the x,y axis to be placed on the graph
      totalWid = 500,
      totalHeight = 500,
      width = totalWid - margin.left - margin.right,
      height = totalHeight - margin.top - margin.bottom;

  //creates a function that maps from data space (domain) to display/pixel space (range)
  var x = d3.scale.linear()
      .domain([0, d3.max(data, value_accessor_method )])
      .range([0, width]);

  var y = d3.scale.ordinal()
    .domain(data.map(label_accessor_method))
    .rangeRoundBands([0, height]);//scales ordinal data to be equal height proportional to the total height

  //bind axis to existing x and y scales and set its position relative to graph
  var xAxis = d3.svg.axis()
    .scale(x)//tells D3 how to scale and place the tick marks
    .tickFormat(d3.format("s"))//format numbers to use K for 1000, M for 1,000,000, etc
    .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var chart = d3.select(html_id_name)//select HTML element
      .attr("viewBox", "0 0 "+totalWid+" "+totalHeight) //set the height and width to be responsive via the viewbox attribute
      .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")//apply margins by offsetting the origin of the chart area by the top-left margin
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");//apply margins by offsetting the origin of the chart area by the top-left margin

  //add a title to the chart at the top middle
  chart.append("text")
    .attr("x", (width / 2) + margin.left)
    .attr("y", 5 - (margin.top / 2) )
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title_string);

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
      .attr("width", function(d) { return x(value_accessor_method(d)) }) //scale bar from domain to pixel range
      .attr("height", y.rangeBand());//one less than potential total to create padding between bars

  bar.append("text")//text describing the bar chart must be placed explicitly
      .text(function(d) { return value_accessor_method(d); })//First, set the 'text' element's wording to the data value
      .attr("x", function(d) {//set text's x position next to end of its bar
        var textPos = x(value_accessor_method(d)) - 3;//text is placed inside of its bar
        var l = this.getComputedTextLength();
        if(textPos - l < x(0) + 5 ){//the text will be off the left side of the bar (into the y axis), thus it must be moved
          textPos =  x(value_accessor_method(d)) + l + 3;//instead, place text to the right of its bar
        }
        return textPos;
      })
      .attr("y", y.rangeBand() / 2)//approximately center the text vertically
      .attr("dy", ".35em");//exactly center text vertically (text is .7em)

}

// Copied and modified from: https://gist.github.com/enjalot/1203641
//  Labels: http://jsfiddle.net/Qh9X5/1196/
function create_pie_chart(data,title_string,html_id_name,label_accessor_method,value_accessor_method){
  //organize the data to be descending with respect to it accessed value
  data.sort(function(a,b){
    return value_accessor_method(a) - value_accessor_method(b) ;
  });

    var color = d3.scale.category20c();     //builtin range of colors

    var totalWid = 500,
        totalHeight = totalWid,
        margin = {top: totalWid/4, right: totalWid/4, bottom: totalWid/4, left: totalWid/4},//this acts as svg padding, and allows space for the x,y axis to be placed on the graph
        width = totalWid - margin.left - margin.right,
        height = totalHeight - margin.top - margin.bottom,
        labelr = r + 30, // radius for label anchor from text to pie chart
        r = width / 2,//radius for pie chart sizing
        arc = d3.svg.arc().innerRadius(r * .4).outerRadius(r);             //this will create <path> elements for us using arc data

    var chart = d3.select(html_id_name)
      .attr("viewBox", "0 0 "+totalWid+" "+totalHeight) //set the height and width to be responsive via the viewbox attribute
      .attr("preserveAspectRatio", "xMinYMin meet");

    //add a title to the chart at the top middle
    chart.append("text")
      .attr("x", (width / 2) + margin.left)
      .attr("y", margin.top / 2 )
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(title_string);

    var vis = chart
        .data([data])
      .append("g")                    //make a group to hold our pie chart, and move it relative to the entire svg
        .attr("transform", "translate(" + (r+margin.left) + "," + (r+margin.top) + ")")    //move the center of the pie chart from 0, 0 to radius, radius (and apply margins!)

    vis.append("g")                    //make a group to hold our pie chart, and move it relative to the entire svg
      .attr("transform", "translate(" + (r+margin.left) + "," + (r+margin.top) + ")")    //move the center of the pie chart from 0, 0 to radius, radius (and apply the margins!)

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.num_groups; });    //we must tell it out to access the value of each element in our data array
    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("g")                    //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)
        arcs.append("path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        arcs.append("text")                                         //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return label_accessor_method(data[i]); });        //get the label from our original data array

}

var w = 800;
var h = 500;
var padding = 40;
var svgChart,xScale,yScale;
//Create scale functions
function setScales(){
  w = document.getElementById("content").clientWidth;
h = w*0.625;
xScale = d3.scaleLinear()
 .domain([0, 365])
 .range([padding, w - padding]);

yScale = d3.scaleLinear()
 .domain([24,0])
 .range([h - padding, padding]);
//svg for chart
}


function runTool(){
  setScales();
  setTitle();
  getMetaData();
  getData();

}


function initChart()
{
  setScaleBar();
  drawAxes();
  drawScaleBar();
  chartUpdate();
}


function drawAxes(){

	svgChart = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
//axis
	svgChart.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (h - padding) + ")")
	.call(d3.axisBottom(xScale)
	.ticks(10));   

// text label for the x axis
	svgChart.append("text")             
	.attr("transform","translate(" + (w/2) + " ," + (h-padding/3) + ")")
	.style("text-anchor", "middle")
	.text("Day");

//y axis
	svgChart.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + (w - padding) +",0 )")
	.call(d3.axisRight(yScale).ticks(5));

 // text label for the y axis
	svgChart.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", w-padding/3 )
	.attr("x",-h/2 )
	.attr("dy", "1em")
	.style("text-anchor", "middle")
	.text("Hour");  

}

function chartUpdate(){
  var rectW = (w-2*padding)/365;
  var rectH = (h-2*padding)/24;
  //DATA JOIN see https://bl.ocks.org/mbostock/3808218
    var rects=svgChart.selectAll("rect")
    .data(dataset,function(d){return d;});

    //ENTER and create new stuff
    rects.enter()
    .append("rect")
    .attr("x", function(d){return xScale(d.day);})
    .attr("y", function(d){return yScale(d.hour);})
    .attr("width", rectW)
    .attr("height",rectH)
    .attr("fill", function(d) {return getColorSpectral(d.field);})
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
    
    // EXIT
    // Remove old elements as needed.
    rects.exit().remove();

    d3.select(".mOver").remove();
}
// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this).attr("fill", "red");
  svgChart.append("text")
  .attr("x", xScale(d.day)-padding)
  .attr("y", yScale(d.hour))
  .text(d.field+units+" "+datafield +" at "+timeset(d.hour)+" on day "+d.day)
  .attr("class", "mOver");
  // Specify where to put label of text
  
}
function timeset(hour){
  if(hour<12) return hour+"am";
  if(hour===12) return "midday";
  if(hour>12) return hour-12+"pm";
  }
function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr("fill", getColorSpectral(d.field));
  d3.select(".mOver").remove();

  // Select text by id and then remove
  
}



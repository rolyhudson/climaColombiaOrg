var hexSize=10;
var reportdiv;
var color = d3.scaleLinear()
    .domain([0, 50])
    .range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);

function addClimateBins(data,svgChart){
var binData = convertDataToHumRatio(data);
hexagonalBin(binData,svgChart);
return binData;
}

function convertDataToHumRatio(data){
  var satPress;
  var partialPress;
  var t,rh;
  dataOut=[];
  for(var i=0;i<data.length;i++){
   t=Number(data[i][0]);
   rh=Number(data[i][1]);
    satPress= saturationPress(t);
    partialPress = partPress(rh,satPress);
    dataOut.push([xScale(t),yScale(1000*humidtyRatio(atmosPress,partialPress)),rh]); 
  }
  return dataOut;
}
function hexagonalBin(data,svg){
    d3.selectAll(".hexagon").remove();
var hexbin = d3.hexbin()
    .size([w, h])
    .radius(hexSize);

svg.append("g")
    .attr("clip-path", "url(#clip)")
  .selectAll(".hexagon")
    .data(hexbin(data))
  .enter().append("path")
    .attr("class", "hexagon")
    .attr("d", hexbin.hexagon())
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y+ ")"; })
    .style("fill", function(d) { return color(d.length); })
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}
function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
   d3.select(this).style("fill", "red");
  // svgChart.append("text")
  // .attr("x", 5)
  // .attr("y", 40)
  // .text(d.length+" climate hours in bin")
  // .attr("class", "mOver");

var tMin =inXScale(d.x-hexSize/2);
var tMax =inXScale(d.x+hexSize/2);
var hrMin =inXScale(d.y-hexSize/2);
var hrMax =inXScale(d.y+hexSize/2);

  // svgChart.append("text")
  // .attr("x", 5)
  // .attr("y", 55)
  // .text("temp range: "+round(tMin,1)+"-"+round(tMax,1))
  // .attr("class", "mOver");

  // svgChart.append("text")
  // .attr("x", 5)
  // .attr("y", 70)
  // .text("humidty ratio range: "+round(hrMin,1)+"-"+round(hrMax,1))
  // .attr("class", "mOver");

var rhMin =d3.min(d, function(d) { return +d[2];} );

var rhMax =d3.max(d, function(d) { return +d[2];} );

var report  =d.length+" climate hours in bin, " + "temp range: "+round(tMin,1)+"-"+round(tMax,1) + ", humidty ratio range: "+round(hrMin,1)+"-"+round(hrMax,1);

  svgChart.append("text")
  .attr("x", 5)
  .attr("y", 15)
  .text(report)
  .attr("class", "mOver");
 //console.log(d.length +","+ d );
  // Specify where to put label of text
  
}

function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).style("fill", function(d) { return color(d.length); });
  d3.selectAll(".mOver").remove();

  // Select text by id and then remove
  
}

var svgChart;
var projection;

function setMap(mapfile,lon,lat,scale){
setUp(lon,lat,scale);
d3.queue()
    .defer(d3.json, mapfile)
    .await(drawMap);
}

function setUp(lon,lat,scale){
  
 
 d3.selectAll(".chart").remove();
 svgChart = d3.select("#chart")
  .append("svg")
  .attr("class","chart")
  .attr("width", w)
  .attr("height", h)
  .call(d3.zoom().on("zoom", function () {
              svgChart.attr("transform", d3.event.transform)
      }))
      .append("g");

}
function drawMap(error, data){
  if (error) throw error;
  console.log(data);

  d3.selectAll(".map").remove();
  
//assuming only one set of features 
  var features;
  for(var prop in data.objects)
  {
    features = prop;
  }
var colom = topojson.feature(data,data.objects[features]);
  projection = d3.geoMercator().fitExtent([[0, 0], [w, h]], colom);
  var path = d3.geoPath()
    .projection(projection); 
  svgChart.append("path")
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.70)
      .attr("class","map")
      .attr("d", path(topojson.mesh(data,data.objects[features])));
}
function defineCell(d){
  var cell=[];
  var p1 = projection([d.lon,d.lat]);
  var p2 = projection([d.lon+0.5,d.lat]);
  cell[0] = Math.round(Math.abs(p1[0]-p2[0]));
  p2 = projection([d.lon,d.lat+0.5]);
  cell[1] = Math.round(Math.abs(p1[1]-p2[1]));
  return cell;
}
function chartUpdate(){
  // remove previous
  d3.selectAll(".mapBlocks").remove();

 var  rects=svgChart.selectAll("rect")
    .data(dataset,function(d){return d;})
    .enter()
   .append("rect")
   .attr("x", function (d) { return projection([d.lon-0.25,d.lat+0.25])[0];})
   .attr("y", function (d) { return projection([d.lon-0.25,d.lat+0.25])[1];})
   .attr("width", function(d){return defineCell(d)[0];})
   .attr("height", function(d){return defineCell(d)[1];})
   .attr("fill-opacity",0.8)
   .attr("fill",function (d) {return setCol(d);} )
   .attr("class","mapBlocks")
    .attr("id",function(d){return getValueFromCell(d);})
   .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
}

// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
  // Use D3 to select element, change color and size
  d3.select(this).attr("fill", "red");
  var info = getAllValuesFromCell(d);

  updateText("Cell detail: Monthly "+info,"cellDetail");
  // get the block in the scale bar
  var v = getValueFromCell(d);

  highlightedBlock=findValueInLabelMap(v);
  highlightBlock("red");

}


function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr("fill",function (d) {return setCol(d);} )
  updateText("Cell detail:","cellDetail");
  scaleblocks[highlightedBlock].style.fill = getColorSpectral(highlightedBlock);
  // Select text by id and then remove
  
}
function setCol(d){
//need to get the value from d and return a colour
var t =getValueFromCell(d);
t = findValueInLabelMap(t);


if(isNaN(t)){
  //text description
  t = matchtextToLabels(t);
  }
 
return getColorSpectral(t);
}

function findValueInLabelMap(t){

  for(var i=0;i<labelMap.length;i++){
    if(t===labelMap[i].index) {

      //if(currentDimType.indexOf("IDEAM")>-1) return labelMap.length-1-i;
      return i;
    }
  }
}



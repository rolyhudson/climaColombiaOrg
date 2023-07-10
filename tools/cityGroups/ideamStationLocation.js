var svg;
var sCount;
var w = 1200;
var h = 500;
var projection;
function runMap(){
  setTitleGrid("city source stations");
 w = document.getElementById("content").clientWidth;
  h=w*0.77;

svg = d3.select("#chart").append("svg")
    .attr("width", w)
    .attr("height", h);

    svg.append("text")
  .attr("x", w/2)
  .attr("y", h/2)
  .text("loading data...")
  .attr("class", "loading");

  //setMap();
  showRegions(); 
   
}
function plotRegionalStations(){

  d3.queue()
    .defer(d3.json, "regionalstations.json")
    .await(regional);
}
function plotLocalStations(){

  d3.queue()
    .defer(d3.json, "cityregiongroups.json")
    .await(local);
}
function getColorCity(t){

var cScale = d3.scaleLinear()
 .domain([0,4])
 .range([0, 1]);

  return d3.interpolateWarm(cScale(t));
}

function local(error, data)
{
console.log(data);
 //add all the cities
 svg.selectAll(".city")
    .data(data.cities).enter()
    .append("circle")
    .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
    .attr("r", function(d){return fiftyKMinPX(d.lon,d.lat)+"px"})
    .attr("fill","white")
        .attr("fill-opacity", 0.4)
    .attr("stroke-width", 1)
.attr("stroke", "black")
    .attr("class","city")
    .on("mouseover", handleMouseOverCity)
    .on("mouseout", handleMouseOutCity);
//add the links
for(var i=0;i<data.cities.length;i++)
{
  var startX = data.cities[i].lon;
  var startY = data.cities[i].lat;

  for(var j=0;j<data.cities[i].stations.length;j++)
  {
    var endX = data.cities[i].stations[j].lon;
    var endY = data.cities[i].stations[j].lat;
    var line = svg.append("line")
.attr("x1", function (d) { return projection([startX,startY])[0]; })
.attr("y1", function (d) { return projection([startX,startY])[1]; })
.attr("x2", function (d) { return projection([endX,endY])[0]; })
.attr("y2", function (d) { return projection([endX,endY])[1]; })
.attr("stroke-width", 1)
.attr("class","link "+data.cities[i].name)
.attr("stroke", "black");
  }
}
    
plotRegionalStations();
}
function regional(error, data)
{
  console.log(data);
  var s = svg.selectAll(".stationsregional");
  for(var i=0;i<data.regions.length;i++)
  {
    var color = getColorCity(i);
    
    var stations = data.regions[i].stations;
    var rname = data.regions[i].name;
    s.data(stations).enter()
    .append("circle")
    .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
    .attr("r", "2px")
    .attr("fill", color)
    .attr("class","stationsregional")
    .attr("regionname",rname)
    .on("mouseover", handleMouseOverRegion)
    .on("mouseout", handleMouseOutRegion);
    
  }
   d3.select(".loading").remove();
}

function fiftyKMinPX(lon,lat)
{
  var current = projection([lon,lat])[1];
  var newpos = projection([lon,lat+0.5])[1];
  var fiftykm = Math.abs(current-newpos);
  return fiftykm;
}

function handleMouseOverCity(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  var links = document.getElementsByClassName("link "+d.name);
  for(var i=0;i<links.length;i++){
    links[i].style.display="block";
  }
  d3.select(this);
  svg.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("font-weight","bold")
  .text(d.name +" altitude: " + d.ele + " regional stations "+d.stations.length+":")
  .attr("class", "mOver");

  this.setAttribute("fill", "plum");

  svg.append("text")
  .attr("x", this.attributes.getNamedItem("cx").value)
  .attr("y", this.attributes.getNamedItem("cy").value-fiftyKMinPX(d.lon,d.lat))
  .text(d.name )
  .attr("class", "mOver");

  for(var i=0;i<d.stations.length;i++)
  {
    svg.append("text")
  .attr("x", 0)
  .attr("y", (i+2)*20 )
  .text(d.stations[i].name +" altitude: " + d.stations[i].ele)
  .attr("class", "mOver");
  }
  // Specify where to put label of text
  
}
function handleMouseOverRegion(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this);
  var rname = this.attributes.getNamedItem("regionname").value;
  svg.append("text")
  .attr("x", 0)
  .attr("y", 20 )
  .text("Station: " +d.name +" altitude: " + d.ele+" region: "+rname)
  .attr("class", "mOver");
  // Specify where to put label of text
  
}
function handleMouseOutCity(d, i) {
  var links = document.getElementsByClassName("link "+d.name);
  for(var i=0;i<links.length;i++){
    links[i].style.display="none";
  }
  // Use D3 to select element, change color back to normal
  d3.select(this)
  d3.selectAll(".mOver").remove();
  
  this.setAttribute("fill", "white");

  // Select text by id and then remove
}

function handleMouseOutRegion(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this)
  d3.selectAll(".mOver").remove();
//
  // Select text by id and then remove
  
}


function showRegions()
{
  d3.json("regionsTopo.json", function(error, reg) {
  if (error) throw error;
  console.log(reg);
 var colom = topojson.feature(reg,reg.objects["regionsGEOJSON"]);
 projection = d3.geoMercator().fitExtent([[0, 0], [w, h]], colom);
  var path = d3.geoPath()
    .projection(projection); 

    svg.append("path")
    .attr("class","region")
      .attr("fill", "grey")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .attr("d", path(topojson.mesh(reg,reg.objects.regionsGEOJSON)));
});
  plotLocalStations();
}


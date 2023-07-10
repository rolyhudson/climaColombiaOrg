var svg;
var svgPoints;
var sCount;
var projection; 
var width,height;
function runMap(){
  setTitle();
  width = document.getElementById("content").clientWidth;
  height = width*0.9;

  svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

    svgPoints = d3.select("#points").append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.append("text")
  .attr("x", width/2)
  .attr("y", height/2)
  .text("cargando datos...")
  .attr("class", "loading");

  setMap();
   
}
function plotRegionalStations(){

  d3.queue()
    .defer(d3.json, "data/json/regionalstations.json")
    .await(regional);
}
function plotLocalStations(){

  d3.queue()
    .defer(d3.json, "data/json/citygroups.json")
    .await(local);
}
function getColorSpectral(t){

var cScale = d3.scaleLinear()
 .domain([0,4])
 .range([0, 1]);

  return d3.interpolateWarm(cScale(t));
}

function local(error, data)
{
console.log(data);
 //add all the cities
 svgPoints.selectAll(".city")
    .data(data.cities).enter()
    .append("circle")
    .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
    .attr("r","3px")
    .attr("fill","red")
    .attr("stroke-width", 0)
    .attr("class","city")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .on("click",mouseClick);

    d3.select(".loading").remove();
//add the links
// for(var i=0;i<data.cities.length;i++)
// {
//   var startX = data.cities[i].lon;
//   var startY = data.cities[i].lat;

//   for(var j=0;j<data.cities[i].stations.length;j++)
//   {
//     var endX = data.cities[i].stations[j].lon;
//     var endY = data.cities[i].stations[j].lat;
//     var line = svg.append("line")
// .attr("x1", function (d) { return projection([startX,startY])[0]; })
// .attr("y1", function (d) { return projection([startX,startY])[1]; })
// .attr("x2", function (d) { return projection([endX,endY])[0]; })
// .attr("y2", function (d) { return projection([endX,endY])[1]; })
// .attr("stroke-width", 1)
// .attr("stroke", "black");
//   }
// }
    
//plotRegionalStations();
}
function mouseClick(d, i){
   var coords = d3.mouse(this);
   var div = document.getElementById("downloaddiv");
   while (div.firstChild) {
    div.removeChild(div.firstChild);
}
   div.style.display = "inline";
   
      div.style.left =coords[0]+"px";
      div.style.top =coords[1]+"px";

      var p = document.createElement('p');
      p.appendChild(document.createTextNode(d.name));
      div.appendChild(p);

      var btn = document.createElement("BUTTON");
      var t = document.createTextNode("DOWNLOAD"); 
      btn.onclick =function() {downloadEPW(d.name);};      // Create a text node
      btn.appendChild(t);                                // Append the text to <button>
      div.appendChild(btn);
      
      var gr = document.createElement('p');
      var a = document.createElement('a');
      var linkText = document.createTextNode("Graphical summary");
      a.appendChild(linkText);
      a.title = "Graphical summary";
      a.href = rootPath+"/data/epw/rc3_0/graphs/"+d.name+"_synthYear_rc3.jpg";
      gr.appendChild(a);
      div.appendChild(gr);
}
function downloadEPW(city){

  $.ajax({
      url: rootPath+"/data/epw/rc3_0/"+city+"_synthYear_rc3.epw",
      success: download.bind(true, "text/html", city+"_synthYear_rc3.epw")
    });
  //download("data:/data/epw/"+city+"_meanHour.epw", city+"_meanHour.epw", "text/plain");
}
function regional(error, data)
{
  console.log(data);
  var s = svg.selectAll(".stationsregional");
  for(var i=0;i<data.regions.length;i++)
  {
    var color = getColorSpectral(i);
    
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
    .on("mouseover", handleMouseOverRegion).on("mouseout", handleMouseOutRegion);;
    
  }
   
}

function fiftyKMinPX(lon,lat)
{
  var current = projection([lon,lat])[1];
  var newpos = projection([lon,lat+0.5])[1];
  var fiftykm = Math.abs(current-newpos);
  return fiftykm;
}

function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this);
  // svg.append("text")
  // .attr("x", 0)
  // .attr("y", 20)
  // .text(d.name +" altitud: " + d.ele + " estaciones locales "+d.stations.length+":")
  // .attr("class", "mOver");

 
  svg.append("text")
  .attr("x", this.attributes.getNamedItem("cx").value)
  .attr("y", this.attributes.getNamedItem("cy").value)
  .text(d.name )
  .attr("class", "mOver");

  // for(var i=0;i<d.stations.length;i++)
  // {
  //   svg.append("text")
  // .attr("x", 0)
  // .attr("y", (i+2)*20 )
  // .text(d.stations[i].name +" altitud: " + d.stations[i].ele)
  // .attr("class", "mOver");
  // }
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
function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this)
  d3.selectAll(".mOver").remove();
 
  // Select text by id and then remove
}

function handleMouseOutRegion(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this)
  d3.selectAll(".mOver").remove();
//
  // Select text by id and then remove
  
}
function setTitle(){
  
  var tit = document.getElementById("title");
  var x = document.createElement("h3");

  var t = document.createTextNode("Click a city on the map to download the individual file and access the graphical summary");//Haga clic en la ciudad para descargar datos
  x.appendChild(t);
  tit.appendChild(x);
}

function showRegions()
{
  d3.json("data/maps/regionsTopo.json", function(error, reg) {
  if (error) throw error;
  console.log(reg);

 
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

function setMap(){
d3.json("data/json/COL_depts_municipsSimpleTopo.json", function(error, col) {
  if (error) throw error;
  console.log(col);

 var colom = topojson.feature(col,col.objects.COL_adm1);
 
  
  
  projection = d3.geoMercator().fitExtent([[0, 0], [width, height]], colom);
  showRegions(); 
  
  
       
      
  
});
}
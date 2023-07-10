var svg;
var sCount;
var projection; 
var width;
var height;
  var path = d3.geoPath()
    .projection(projection);
function runMap(){
  setTitle();
width = document.getElementById("content").clientWidth;
height=width*0.95;

svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.append("text")
  .attr("x", width/2)
  .attr("y", height/2)
  .text("loading data...")
  .attr("class", "loading");

  setMap();
}
function getData(){
  
  d3.json("../../data/json/colStations.json", function(error, stations) {
  if (error) throw error;
  
    svg.selectAll("circle")
    .data(stations.data).enter()
    .append("circle")
    .attr("cx", function (d) { return projection([d[17][2],d[17][1]])[0]; })
    .attr("cy", function (d) { return projection([d[17][2],d[17][1]])[1]; })
    .attr("r", "2px")
    .attr("fill", "red")
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);
    
 d3.select(".loading").remove();


  });
}

function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this);
  svg.append("text")
  .attr("x", 0)
  .attr("y", 20 )
  .text(d[10] +" altitude: " + d[18])
  .attr("class", "mOver");
  // Specify where to put label of text
  
}


function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this);
  d3.select(".mOver").remove();

  // Select text by id and then remove
  
}
function setTitle(){
  
  var tit = document.getElementById("title");
  var x = document.createElement("h1");

  var t = document.createTextNode("Map of meteorological stations in Colombia");
  x.appendChild(t);
  tit.appendChild(x);
}
function setMap(){
d3.json("../../data/json/COL_depts_municipsSimpleTopo.json", function(error, col) {
  if (error) throw error;
  console.log(col);

 var colom = topojson.feature(col,col.objects.COL_adm1);
 projection = d3.geoMercator().fitExtent([[0, 0], [width, height]], colom);
 
  var path = d3.geoPath()
    .projection(projection); 

    svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.35)
      .attr("d", path(topojson.mesh(col,col.objects.COL_adm2)));

  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.70)
      .attr("d", path(topojson.mesh(col,col.objects.COL_adm1)));
      getData();    
  
});
}
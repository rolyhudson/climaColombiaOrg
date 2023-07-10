//svg for chart
var svgChart;
var svgScaleBar;

var variables =["altitude","daily mean temperature","daily mean relative humdity","vapour pressure","monthly average daily minimum temperature","monthly average daily maximum temperature","monthly average daily minimum pmv","monthly average daily maximum pmv","monthly average daily minimum ppd","monthly average daily maximum ppd","diurnal temperature range"];
var v1 = {"startCol":"#e8e8e8","endCol":'#be64ac', "datafieldIndex":2,"datafield":"relative humdity","minField":0,"maxField":100,"range":0,"step":0,"units":"%","nCols":20};//"temp";
var yearmonth = {"yr":1999,"m":5};
var w = 1000;
var h = 1000;

var scaleWidth =150;
var scaleHeight=150;

var projection;
var projectedCell = [];
var alldata; //all data from the json
var dataset =[];//subset of data

function getColorSpectral(v,min,max){

var cScale = d3.scaleLinear()
 .domain([min,max])
 .range([1, 0]);

  return d3.interpolateSpectral(cScale(v));
}
function paramsChanged(){
    var s = document.getElementsByClassName("comfortParam");
    var title;
    var units;
    for (var i = 0; i < s.length; i++) { 
      var id = s[i].getAttribute("id");  
      title =id.substring(0, id.length - 8);
      var e = document.getElementById(id);
      
      switch(title){
        case "air speed":
        params.vel = e.value;
        units ="m/s";
        break;
        case "metabolic rate":
        params.met= e.value;
        units ="met";
        break;
        case "clothing":
        params.clo = e.value;
        units ="clo";
        break;
      }
updateText(e.value+" "+units,title+"value");
    }
    var s = document.getElementsByClassName("yearmonth");
    var id = s[0].getAttribute("id");
    title =id.substring(0, id.length - 8);
    e = document.getElementById(id);
    updateText(e.value,title+"value");
    yearmonth.m = e.value-1;

    getSubsetData();
    chartUpdate();
}
function drawScaleBar(){
  
  var barwidth = w/3;
  var control = document.getElementById("control");
 // control.setAttribute("style","width:"+barwidth+"px");
  var barheight = h/30;
  var barBlocks =v1.nCols;
  var blockW =barwidth/barBlocks;
  var range =v1.maxField-v1.minField;
  var step = range/barBlocks;
  
  var labelData=[];
  
  for(var i=v1.minField;i<=v1.maxField;i+=step)
  {
    labelData.push(i);
  }

  // DATA JOIN
 var rects=svgScaleBar.selectAll("rect")
    .data(labelData);
  //ENTER
  rects.enter()
      .append("rect")
      .attr("x", function(d,i){return i*blockW;})
      .attr("y", 0)
      .attr("width", blockW)
      .attr("height", barheight)
      .style("fill", function(d) {return getColorSpectral(d,v1.minField,v1.maxField);});
   // EXIT   
  rects.exit().remove();

   var numLabels =4;
  step = range/numLabels;

  var labels=[];
  for(var i=v1.minField;i<=v1.maxField;i+=step)
  {
    labels.push(Math.round(i));
  }
  var labelX=barwidth/(labels.length-1);
// refresh labels rather than data join
d3.selectAll(".label").remove();
var label=svgScaleBar.selectAll(".label")
.data(labels)
.enter()
    .append("text")
    .attr("class","label")
    .attr("transform",  function(d, i) { return "translate(" + (i*labelX) + "," + (barheight+10) + ")"; })
    .attr("dy", ".35em")
    .text(String);
}

function setVariablesUp(){
  addText("control","Thermal comfort variables for PMV and PPD comfort:","comTitle","h3");
  var start,end,step,optionSet;
  var title;
  var id;   
  var units;
      for (var i=1;i<4;i++) {
        
        switch(i) {
          
          case 1:
              start =0,end=4,step=0.1;
              title ="air speed";
              id = "control";
              optionSet  = params.vel;
              units = "m/s";
              break;
          
          case 2:
              start =1,end=2,step=0.05;
              title ="metabolic rate";
              id = "control";
              optionSet  = params.met;
              units ="met";
              break;
          case 3:
              start =0,end=4.5,step=0.05;
              title ="clothing";
              id = "control";
              optionSet  = params.clo;
              units = "clo";
              break;

        }
  addRangeSlider(id,title,title+'Selector',"paramsChanged()",start,end,step,optionSet,"comfortParam","h3",units);
  }
  
}
function runTool(){
  addText("title","Gridded monthly data, climate / altitude / comfort for Colombia","mainTitle","h1");
w = document.getElementById("content").clientWidth;
h=w*0.77;
  svgChart = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);



   //set the svg for the legend
  svgScaleBar = d3.select("#scale")
  .append("svg")
  .attr("width", w/2.5)
  .attr("height", h/15)
  .attr("class","svgScaleBar");

  setSelectorData("description","","variableSelector1","variableChanged()",variables,2);
   
  addRangeSlider("control","month","monthSelector","paramsChanged()",1,12,1,6,"yearmonth","h3","");
  setVariablesUp();
  setFieldMinMax(v1);

  
loading();
  

  // projection = d3.geoMercator()//.fitExtent([[0, 0], [width, height]], colom);
  // .center([-70.5,7.5])
  // .scale([2300]);
  setMap();
}
function variableChanged(){
  var e = document.getElementById('variableSelector1');
  v1.datafield = e.options[e.selectedIndex].text;
  v1.datafieldIndex =e.selectedIndex;
  setFieldMinMax(v1);
  
  chartUpdate();
  drawScaleBar();
}
function setFieldMinMax(variable){
  switch(variable.datafieldIndex) {
    case 0://alt
        variable.minField=-3;
        variable.maxField=4300;
        variable.units="m";
        break;
    case 1://temp
        variable.minField=0;
        variable.maxField=35;
        variable.units="\xB0C";
        break;
    case 2://rh
        variable.minField=0;
        variable.maxField=100;
        variable.units="%";
        break;
    case 3://vapour pressure;
        variable.minField=0;
        variable.maxField=400;
        variable.units="pa";
        break;
    case 4://monthly average daily minimum temperature;
        variable.minField=0;
        variable.maxField=35;
        variable.units="\xB0C";
        break;
    case 5://monthly average daily maximum temperature;
        variable.minField=0;
        variable.maxField=35;
        variable.units="\xB0C";
        break;
    case 6://"monthly average daily minimum pmv"
        variable.minField=-5;
        variable.maxField=5;
        variable.units="";
        break;
    case 7://"monthly average daily maximum pmv"
        variable.minField=-5;
        variable.maxField=5;
        variable.units="";
        break;
    case 8://monthly average daily minimum ppd
        variable.minField=0;
        variable.maxField=100;
        variable.units="%";
        break;
    case 9://monthly average daily maximum ppd
        variable.minField=0;
        variable.maxField=100;
        variable.units="%";
        break;
    case 10://diurnal temperature range"
        variable.minField=0;
        variable.maxField=35;
        variable.units="\xB0C";
        break;
    }
    setVRange(variable);
}
function setVRange(v){
  v.range = v.maxField-v.minField;
  v.step = v.range/v.nCols;
}
function defineCell(){
var p1 = projection([dataset[0].lon,dataset[0].lat]);
var p2 = projection([dataset[0].lon+0.5,dataset[0].lat]);
projectedCell[0] = Math.round(Math.abs(p1[0]-p2[0]));
p2 = projection([dataset[0].lon,dataset[0].lat+0.5]);
projectedCell[1] = Math.round(Math.abs(p1[1]-p2[1]));
}
function getSubsetData(){
dataset =[];
var m = yearmonth.m;

for(var i=0;i<alldata.length;i++)
{
  var cellMinComfort = pmvppd(alldata[i].min[0][m]/10, alldata[i].min[0][m]/10, params.vel,alldata[i].rh[0][m], params.met, params.clo, 0);
  var cellMaxComfort = pmvppd(alldata[i].max[0][m]/10, alldata[i].max[0][m]/10, params.vel,alldata[i].rh[0][m], params.met, params.clo, 0);


  dataset.push({"lon":alldata[i].location.coords[0],"lat":alldata[i].location.coords[1],"alt":alldata[i].location.alt,"t":alldata[i].temp[0][m]/10,"rh":alldata[i].rh[0][m],"vp":alldata[i].vp[0][m],
"tmin":alldata[i].min[0][m]/10,"tmax":alldata[i].max[0][m]/10,"trange":alldata[i].range[0][m]/10,"ppvmin":cellMinComfort.pmv,"ppvmax":cellMaxComfort.pmv,"ppdmin":cellMinComfort.ppd,"ppdmax":cellMaxComfort.ppd});
}

}
function getData(){
  
  d3.json("weaMonthlyjson.json", function(error, data) {
  if (error) throw error;
  
    console.log(data);
    alldata =data;
    getSubsetData();


defineCell();
var max = d3.max(dataset, function(d) { return d.alt; });
var min = d3.min(dataset, function(d) { return d.alt; });
loaded();
    chartUpdate();
    drawScaleBar();
  });
}
function chartUpdate(){
  //DATA JOIN see https://bl.ocks.org/mbostock/3808218
    var rects=svgChart.selectAll("rect")
    .data(dataset,function(d){return d;});

   //ENTER and create new stuff
   rects.enter()
   .append("rect")
   .attr("x", function (d) { return projection([d.lon-0.25,d.lat+0.25])[0];})
   .attr("y", function (d) { return projection([d.lon-0.25,d.lat+0.25])[1];})
   .attr("width", projectedCell[0])
   .attr("height",projectedCell[1])
   .attr("fill-opacity",0.8)
   .attr("fill",function (d) {return setCol(d);} )
   .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

   // EXIT
    // Remove old elements as needed.
    rects.exit().remove();
}
// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity

  // Use D3 to select element, change color and size
  d3.select(this).attr("fill", "red");
  
  svgChart.append("text")
   .attr("x", 0)
  .attr("y", 990)
  .text("elev:"+d.alt+", temp:"+d.t+", rh:"+d.rh+", vapour press:"+d.vp
    +", min day temp:"+d.tmin+", max day temp:"+d.tmax+", min day pmv:"+d.ppvmin.toFixed(2) 
    +", max day pmv:"+d.ppvmax.toFixed(2)+", min day ppd:"+d.ppdmin.toFixed(2)+", max day ppd:"+d.ppdmax.toFixed(2)
    +", diurnal temp range:"+d.trange)
  .attr("class", "mOver");
  // Specify where to put label of text
  
}
function loading(){

svgChart.append("text")
  .attr("x", 20)
  .attr("y", 40)
  .text("loading data...")
  .attr("font-size",35)
  .attr("class", "loading");
}
function loaded(){
  d3.select(".loading").remove();
}
function handleMouseOut(d, i) {
  // Use D3 to select element, change color back to normal
  d3.select(this).attr("fill",function (d) {return setCol(d);} )
  d3.select(".mOver").remove();

  // Select text by id and then remove
  
}
function setDataField(variable,d){
var var1;
 switch(variable.datafieldIndex)
 {
  case 0://alt
        var1=d.alt;
        break;
    case 1://temp
        var1=d.t;
        break;
    case 2://rh
        var1=d.rh;
        break;
    case 3://vapour pressure;
        var1=d.vp;
        break;
    case 4://monthly average daily minimum temperature;
        var1=d.tmin;
        break;
    case 5://monthly average daily maximum temperature;
        var1=d.tmax;
        break;
    case 6://"monthly average daily minimum pmv"
        var1=d.ppvmin;
        break;
    case 7://"monthly average daily maximum pmv"
        var1=d.ppvmax;
        break;
    case 8://monthly average daily minimum ppd
        var1=d.ppdmin;
        break;
    case 9://monthly average daily maximum ppd
        var1=d.ppdmax;
        break;
    case 10://diurnal temperature range"
       var1=d.trange;
        break;
 }
 return var1;
}
function setCol(d){
var val1 = setDataField(v1,d);
return getColorSpectral(val1,v1.minField,v1.maxField);
}


function setMap(){


d3.json("COL_depts_municipsSimpleTopo.json", function(error, col) {
  if (error) throw error;
  console.log(col);

 var colom = topojson.feature(col,col.objects.COL_adm1);
 
 projection = d3.geoMercator().fitExtent([[0, 0], [w, h]], colom);

  var path = d3.geoPath()
    .projection(projection); 

    svgChart.append("path")
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.35)
      .attr("d", path(topojson.mesh(col,col.objects.COL_adm2)));

  svgChart.append("path")
      .attr("fill", "none")
      .attr("stroke", "#777")
      .attr("stroke-width", 0.70)
      .attr("d", path(topojson.mesh(col,col.objects.COL_adm1)));
          
  addGrid();
});
}

function addGrid(){
  getData();
}
//svg for chart
var svgChart;
var svgScaleBar;

var variables =["altitude","daily mean temperature","daily mean relative humdity","vapour pressure","monthly average daily minimum temperature","monthly average daily maximum temperature","monthly average daily minimum pmv","monthly average daily maximum pmv","monthly average daily minimum ppd","monthly average daily maximum ppd","diurnal temperature range"];
var v2 = {"startCol":"#e8e8e8","endCol":'#5ac8c8',"datafieldIndex":1,"datafield":"temperature","minField":5,"maxField":35,"range":0,"step":0,"units":"\xB0C","nCols":5};

var v1 = {"startCol":"#e8e8e8","endCol":'#be64ac', "datafieldIndex":2,"datafield":"relative humdity","minField":0,"maxField":100,"range":0,"step":0,"units":"%","nCols":5};//"temp";
var yearmonth = {"yr":1999,"m":5};
var w = 1000;
var h = 1000;

var scaleWidth =100;
var scaleHeight=100;

var projection;
var projectedCell = [];
var alldata; //all data from the json
var dataset =[];//subset of data



function drawScaleBar(){
  var yShift = 0;
  var xShift = 15;
  var cellW=scaleWidth/v1.nCols;
  var cellH=scaleHeight/v2.nCols;

  var scale = document.getElementById("scale");

  scale.setAttribute("style","width:"+scaleWidth*2+"px");
  scale.setAttribute("style","height:"+scaleWidth*2+"px");
  
  var data2d = [];

  for(var i=0;i<v1.nCols;i++){
    for(var j=0;j<v2.nCols;j++){
        data2d.push({"x":(i+1)*cellW+xShift,"y":scaleHeight-(j)*cellH+yShift,"v1":(i+1)*v1.step,"v2":(j+1)*v2.step});
    }
  }

   // DATA JOIN
  var rects=svgScaleBar.selectAll(".grid")
    .data(data2d);
  //ENTER
  rects.enter()
      .append("rect")
      .attr("x", function(d) {return d.x;})
      .attr("y", function(d) {return d.y;})
      .attr("width", cellW)
      .attr("height", cellH)
      .attr("fill-opacity",0.8)
      .attr("class","grid")
      .style("fill", function(d) {return setBivarateCol(d.v1,d.v2);});
   // EXIT   
  rects.exit().remove();
  //variable 1 on x axis
 
  var labels=[];
  for(var i=v1.minField;i<=v1.maxField;i+=v1.step)
  {
    labels.push(Math.round(i));
  }
  var labelX=scaleWidth/(labels.length-1);

  // refresh labels rather than data join
    d3.selectAll(".label1").remove();
    var label=svgScaleBar.selectAll(".label1")
    .data(labels)
    .enter()
    .append("text")
    .attr("class","label1")
    .attr("transform",  function(d, i) { return "translate(" + ((i+1)*labelX+xShift) + "," + (scaleHeight+1.5*cellH+yShift) + ")"; })
    .attr("dy", ".35em")
    .text(String);
  

  var titlev1 = svgScaleBar.selectAll(".title1").remove();
  svgScaleBar.append("text")
  .attr("x", labelX+cellW)
  .attr("y", (scaleHeight+2*cellH+8))
  .text(v1.datafield+" "+v1.units)
  .attr("class", "title1");
//variable 2 on y axis
  

  var labels=[];
  for(var i=v2.minField;i<=v2.maxField;i+=v2.step)
  {
    labels.push(Math.round(i));
  }
  var labelY=scaleHeight/(labels.length-1);
  // refresh labels rather than data join
    d3.selectAll(".label2").remove();
    var label=svgScaleBar.selectAll(".label2")
    .data(labels)
    .enter()
    .append("text")
    .attr("class","label2")
    .attr("transform",  function(d, i) { return "translate(" + 0.7*cellW + "," + ((scaleHeight+cellH)-i*labelY+yShift) + ")"; })
    .attr("dy", ".35em")
    .text(String);

  var titlev2 = svgScaleBar.selectAll(".title2").remove();
  svgScaleBar.append("text")
  .attr("transform", "translate("+(0.5*cellW)+","+(scaleHeight+cellH+yShift)+")rotate(-90)")
  .text(v2.datafield+" "+v2.units)
  .attr("class", "title2");


}
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
    drawScaleBar();
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
  addText("title","Gridded, bivariate monthly data, climate / altitude / comfort for Colombia","mainTitle","h1");
w = document.getElementById("content").clientWidth;
h=w*0.77;
  svgChart = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

   //set the svg for the legend
  svgScaleBar = d3.select("#scale")
  .append("svg")
  .attr("width", scaleWidth*2)
  .attr("height", scaleWidth*2)
  .attr("class","svgScaleBar");
  
  setSelectorData("description","X ","variableSelector1","variableChanged()",variables,2);
  setSelectorData("description"," Y ","variableSelector2","variableChanged()",variables,1);
  

  addRangeSlider("control","month","monthSelector","paramsChanged()",1,12,1,6,"yearmonth","h3","");
  setVariablesUp();
  
  setFieldMinMax(v1);
  setFieldMinMax(v2);
  
  loading();

  setMap();
}
function variableChanged(){
  var e = document.getElementById('variableSelector1');
  v1.datafield = e.options[e.selectedIndex].text;
  v1.datafieldIndex =e.selectedIndex;
  setFieldMinMax(v1);
  e = document.getElementById('variableSelector2');
  v2.datafield = e.options[e.selectedIndex].text;
  v2.datafieldIndex=e.selectedIndex;
  setFieldMinMax(v2);
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
var val2 = setDataField(v2,d);
return setBivarateCol(val1,val2);
}

function setBivarateCol(val1,val2){
  //rounding to discrete colors defined in 2d scale
var roundval1 = Math.round(val1/v1.step)*v1.step;
var roundval2 = Math.round(val2/v2.step)*v2.step;
var col1 =getVCol(v1,roundval1 );
var col2 =getVCol(v2,roundval2);
var bivaratecol = geometricMean(col1,col2);
return bivaratecol;
}
function geometricMean(col1,col2){
  var d3col1 = d3.rgb(col1);
  var d3col2 = d3.rgb(col2);
  if(d3col1.r==0)d3col1.r=1;
  if(d3col1.g==0)d3col1.g=1;
  if(d3col1.b==0)d3col1.b=1;
  if(d3col2.r==0)d3col2.r=1;
  if(d3col2.g==0)d3col2.g=1;
  if(d3col2.b==0)d3col2.b=1;
  var r = Math.sqrt(d3col1.r*d3col2.r);
  var g = Math.sqrt(d3col1.g*d3col2.g);
  var b = Math.sqrt(d3col1.b*d3col2.b);

  return "rgb("+parseInt(r, 10)+","+parseInt(g, 10)+","+parseInt(b, 10)+")";
}

function getVCol(variable,val){
  var colScale = d3.scaleLinear().domain([variable.minField,variable.maxField])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb(variable.startCol), d3.rgb(variable.endCol)]);
  return colScale(val);

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
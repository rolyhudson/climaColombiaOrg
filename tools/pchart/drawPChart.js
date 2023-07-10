var w=800;
var h = 500;
var padding=40;

var tempMax =36;
var tempMin =-10;
var humidtyRatioMax = 30;
var humidtyRatioMin =0;
var altitude = 0;
var atmosPress=0;
var lat=0;
var lon=0;
//svg for chart
var svgChart;


var climatePoints=[];//points in chart space to test if inside comfort poly
var comfZpoints=[];
var comfortHours=0;
var city ="Bogota";
var datafield = "Dry Bulb Temperature";
var datafieldIndex =0;
var climateUrl;
var climateObj;//to recive the data

var xScale,yScale,inXScale,inYScale,rhline,comfBound;
function setScales(){
w = document.getElementById("content").clientWidth;
h = w*0.625;

xScale = d3.scaleLinear()
 .domain([tempMin, tempMax])
 .range([0, w - padding]);

yScale = d3.scaleLinear()
 .domain([humidtyRatioMin, humidtyRatioMax])
 .range([h - padding, padding]);

inXScale = d3.scaleLinear()
 .domain([0, w - padding])
 .range([tempMin, tempMax]);

inYScale = d3.scaleLinear()
 .domain([h - padding, padding])
 .range([humidtyRatioMin, humidtyRatioMax]);
//rhline 
rhline = d3.line()
    .x(function(d) { return xScale(d.dbt); })
    .y(function(d) { return yScale(1000*d.hr); });

comfBound = d3.line()
    .x(function(d) { return xScale(d.dbt); })
    .y(function(d) { return yScale(1000*d.hr); });
}
function initChart(){
  
  addText("comfCalc","Comfort Calculator:","comTitle","h4");
  addText("variables","Thermal comfort variables:","comTitle","h4");
  var start,end,step,optionSet;
  var title;
  var id;   
      for (var key in params) {
        console.log(key);
        optionSet=params[key];
        switch(key) {
          case "ta":
              start =-15,end=35,step=1;
              title ="air temp";
              id = "comfCalc";
              break;
          case "tr":
              start =-15,end=35,step=1;
              title ="radiant temp";
              id = "variables";
              break;
          case "vel":
              start =0,end=4,step=0.1;
              title ="air speed";
              id = "variables";
              break;
          case "rh":
              start =0,end=100,step=2;
              title ="relative humidity";
              id = "comfCalc";
              break;
          case "met":
              start =1,end=2,step=0.05;
              title ="metabolic rate";
              id = "variables";
              break;
          case "clo":
              start =0,end=4.5,step=0.05;
              title ="clothing";
              id = "variables";
              break;
          case "wme":
              

              break;
        }
  if(key!="wme")addRangeSlider(id,title,title+'Selector',"paramsChanged()",start,end,step,optionSet,"comfortParam","h5");
  }
  //calc comfort
  var comfort = pmvppd(params.ta, params.tr, params.vel,params.rh, params.met, params.clo, 0);
  addText("comfCalc","Predicted Mean Vote (PMV) = "+round(comfort.pmv,2),"resPMV");
  addText("comfCalc",". Predicted Percentage of Dissatisfied (PPD) = "+round(comfort.ppd,2),"resPPD");

  

  addText("title","Psychrometric chart for "+city+" "+country+" a "+altitude+" msnm","mainTitle","h1");
  
  
  addText("control"," Atmospheric pressure:","","h3");
  addText("control",atmosPress,"press","h3"); 
  addText("control"," Lon:","","h3");
  addText("control",lon,"lon","h3"); 
  addText("control"," Lat:","","h3");
  addText("control",lat,"lat","h3"); 
  chartUpdate();
}
function titleUpdate(){
  updateText("Psychrometric chart for "+city+" "+country+" a "+altitude+" msnm","mainTitle");
  
  updateText(round(atmosPress/1000,2)+"kPa","press");
  updateText(round(lon,2),"lon");
  updateText(round(lat,2),"lat");
}
function runTool(){

  isPChart=true;
 setScales();
  svgChart  = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  getMetaData();
  getData();


}
function chartUpdate(){
defineComfortZone();
  climatePoints=addClimateBins(dataset,svgChart);  
  drawPsychrometricAxes();
  locationChanged();
  titleUpdate();
  setCurrentPoint();
}
function setCurrentPoint(){
  var sPress=saturationPress(params.ta);
  var pPress= partPress(params.rh, sPress);
  var humRatio = humidtyRatio(atmosPress,pPress);
  d3.selectAll(".currentP").remove();
  //var circle= svgChart.selectAll("circle")
  svgChart.append("circle")
  .attr("r", 5)
  .attr("cx", xScale(params.ta))
  .attr("cy", yScale(1000*humRatio))
  .attr("class", "currentP");
}
function defineComfortZone(){

  var data = getComfortBoundary(0.5);
  d3.selectAll(".bound").remove();
           svgChart.append("path")
           .data([data])
          .attr("class", "bound")
          .attr("d", comfBound)
          .attr("id", "cb");

  var text =svgChart.append("text")
  .append("textPath") //append a textPath to the text element
  .attr("xlink:href", "#cb") //place the ID of the path here
  .attr("class", "bound")
  .style("text-anchor","start") //place the text on the path start
  .attr("startOffset", "70%"); 
  text.text("Comfort Boundary");       

  comfZpoints = comfortZoneChartCoords(data);
   comfortHours = hoursInComfortZ(climatePoints, comfZpoints);
   var percentYr = round(comfortHours/87.6,1);
  d3.selectAll(".comfH").remove();
  svgChart.append("text")
  .attr("x", 5)
  .attr("y", 25)
  .text(comfortHours+" hours ("+percentYr+"% of the year) in current comfort zone annually")
  .attr("class", "comfH");
 
}
function comfortZoneChartCoords(data){
  var dataOut=[];
  for(var i=0;i<data.length;i++){
      dataOut.push([xScale(data[i].dbt),yScale(1000*data[i].hr)]);

  }
  return dataOut;
}


function paramsChanged(){
    var s = document.getElementsByClassName('comfortParam');
    var title;
    for (var i = 0; i < s.length; i++) {
     
      var id = s[i].getAttribute("id"); 
      switch(id) {
      case "air tempSelector":
          
          key="ta";
          break;
      case "radiant tempSelector":
          
          key="tr";
          break;
      case "air speedSelector":
          
          key="vel";
          break;
      case "relative humiditySelector":
          
          key="rh";
          break;
      case "metabolic rateSelector":
          
          key="met";
          break;
      case "clothingSelector":
          
          key="clo";
          break;
    }
    title =id.substring(0, id.length - 8);
    var e = document.getElementById(id);
    updateText(e.value,title+"value");
    //for drop down selection:
    //params[key]=Number(e.options[e.selectedIndex].value);
    params[key]=Number(e.value);
  }
  var comfort = pmvppd(params.ta, params.tr, params.vel,params.rh, params.met, params.clo, 0);
  
  updateText("Predicted Mean Vote (PMV) = "+round(comfort.pmv,2),"resPMV");
  
  updateText(". Predicted Percentage of Dissatisfied (PPD) = "+round(comfort.ppd,2),"resPPD");

  defineComfortZone();
  setCurrentPoint();
}


function locationChanged(){
  
  removeRHCurves();
  addRHCurves();
  
  defineComfortZone();
}
function removeRHCurves(){
d3.selectAll(".line").remove();
d3.selectAll(".rhtext").remove();
}

function getRHCurveCoords(rh,altitude){
  var rhData=[];
  
  var satPress;
  var partialPress;
  for(var i=tempMin; i<tempMax;i+=0.5){
      satPress= saturationPress(i);
      partialPress = partPress(rh,satPress);
      rhData.push({"dbt": i,"hr":humidtyRatio(atmosPress,partialPress)});
  }
 return rhData;
}

function drawPsychrometricAxes(){
//axis
d3.selectAll(".axis").remove();
svgChart.append("g")
.attr("class", "axis")
.attr("transform", "translate(0," + (h - padding) + ")")
  .call(d3.axisBottom(xScale)
  .ticks(10));   

// text label for the x axis
svgChart.append("text")             
.attr("transform",
    "translate(" + (w/2) + " ," + 
                   (h-padding/3) + ")")
.style("text-anchor", "middle")
.attr("class", "axis")
.text("Dry Bulb Temperature (C)");

//y axis

      svgChart.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (w - padding) +",0 )")
      .call(d3.axisRight(yScale).ticks(5));

 // text label for the y axis
  svgChart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", w-padding/2 )
      .attr("x",-h/2 )
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("class", "axis")
      .text("Humidity Ratio (g/kg(d.a)");  
}

function addRHCurves()
{
  
  var rhdata;
    for(var i=100;i>9;i-=10){
      rhdata = getRHCurveCoords(i,altitude);
          
          svgChart.append("path")
          .data([rhdata])
          .attr("class", "line")
          .attr("d", rhline)
          .attr("id", "rh"+i);
      //add a path label   
// Add a text label.
 
  var text =svgChart.append("text")
  .append("textPath") //append a textPath to the text element
  .attr("xlink:href", "#rh"+i) //place the ID of the path here
  .attr("class", "rhtext")
  .style("text-anchor","start") //place the text on the path start
  .attr("startOffset", "0%");
  
  if(i===100) text.text(i+"% relative humidity");
  if(i===10) text.text(i+"%");
      
    }
}
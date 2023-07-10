var w=800;
var h = 500;
var padding=40;

var tempMax =45;
var tempMin =-10;
var humidtyRatioMax = 35;
var humidtyRatioMin =0;
var altitude = 0;
var atmosPress=0;
var lat=0;
var lon=0;
var totalHours=0;
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
var startMonth,endMonth,startHour,endHour;
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
  
 
  addText("title","Psychrometric chart for"+city+" "+country+" a "+altitude+" msnm","mainTitle","h1");
  
  addText("control"," Atmospheric pressure:","","h3");
  addText("control",atmosPress,"press","h3"); 
  addText("control"," Lon:","","h3");
  addText("control",lon,"lon","h3"); 
  addText("control"," Lat:","","h3");
  addText("control",lat,"lat","h3"); 
  addTemporalControl();
  chartUpdate();
}
function addTemporalControl(){
  startMonth=1;
  endMonth=12;
  startHour=6;
  endHour=18;
  addRangeSlider("timecontrol","start month","start monthSelector","dateTimeChange()",1,12,1,startMonth,"timecontrollers","h5","");
  addRangeSlider("timecontrol","end month","end monthSelector","dateTimeChange()",1,12,1,endMonth,"timecontrollers","h5","");
  addRangeSlider("timecontrol","start hour","start hourSelector","dateTimeChange()",1,24,1,startHour,"timecontrollers","h5","");
  addRangeSlider("timecontrol","end hour","end hourSelector","dateTimeChange()",1,24,1,endHour,"timecontrollers","h5","");
  
}
function dateTimeChange(event){
  var s = document.getElementsByClassName('timecontrollers');
      var title;
      for (var i = 0; i < s.length; i++) {
       
        var id = s[i].getAttribute("id"); 
        title =id.substring(0, id.length - 8);
        var e = document.getElementById(id);
        updateText(e.value,title+"value");
        switch(id) {
        case "start monthSelector":
            startMonth = e.value;

            break;
        case "end monthSelector":
            endMonth= e.value;

            break;
        case "start hourSelector":
            startHour= e.value;

            break;
        case "end hourSelector":
            endHour= e.value;

            break;
      }
      
  }
  chartUpdate();
}
function filterDataByDateTime(){
  climateObj.hourlyData;
  datafields;
  var daysInMonths = [31,28,31,30,31,30,31,31,30,31,30,31];
  var day = 1;
  var month=1;
  var hour =1;
  totalHours=0;
  var filteredData=[];
  for(var i=0;i<climateObj.hourlyData.length;i++){
    if(hour>=startHour&&hour<=endHour&&month>=startMonth&&month<=endMonth){
      var rh = climateObj.hourlyData[i][rHumidIndex];
      var db = climateObj.hourlyData[i][dbIndex];
      totalHours++;
      filteredData.push([db,rh]);
    }
    hour++;
    if(hour===24){
      day++;
      hour=1;
    }
    if(day===daysInMonths[month]){
      day=1;
      month++;
    }
  }
  dataset = filteredData;
}
function titleUpdate(){
  updateText("Psychrometric chart with design strategies for"+city+" "+country+" a "+altitude+" altitude","mainTitle");
  
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

  filterDataByDateTime();
  climatePoints=addClimateBins(dataset,svgChart);  

  drawPsychrometricAxes();
  locationChanged();
  titleUpdate();
  setStrategy();
  
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

function locationChanged(){
  
  removeRHCurves();
  addRHCurves();
  
  //defineComfortZone();
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
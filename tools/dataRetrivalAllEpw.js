var datafield = "Dry Bulb Temperature";
    var datafields =[];
    var datafieldnames =[];
    var city ="SANTA FE DE BOGOT";
    var cityIndex=0;
    var country = "COLclimacolombia";
    var countryIndex=0;
    var datafield;
    var datafieldIndex=0;
    var dataset;
    var minField=-20;
    var maxField=40;
    var units="\xB0C";

var metaObj;
var cities=[];
var countries=[];
var isPChart=false;
var dbIndex=0;
var rHumidIndex=0;
function countryChanged(){
  d3.select(".mOver").remove();
  var e = document.getElementById('countrySelector');
  country = e.options[e.selectedIndex].text;
  getCities();
  
  updateSelector("citySelector",cities,0);
  cityChanged();
  
}
function cityChanged(){
  d3.select(".mOver").remove();
  var e = document.getElementById('citySelector');
  city = e.options[e.selectedIndex].text;
  
  getNewData();
  
}
function loading(){

document.getElementById("loading").innerHTML="loading data...";
}
function loaded(){
 document.getElementById("loading").innerHTML="";
}
function getNewData(){
  climateUrl = '../../data/json/allEPW/'+country+'/'+country+'_'+city+".json";
loading();
  d3.queue()
    .defer(d3.json, climateUrl)
    .await(refresh);
}
function tryMaintainFields()
{
  datafieldIndex=0;
  for(var i=0;i<datafields.length;i++)
  {
    if(datafield===datafields[i].name)datafieldIndex=i;
  }

}
function refresh(error,data){
  if (error) throw error;
  //console.log(data);
  parseData(data);
  loaded();
  chartUpdate();
  
  if(!isPChart){setTitle();
  drawScaleBar();}
}
function dataFieldChanged(){
  d3.select(".mOver").remove();
  var e = document.getElementById('dataSelector');
  datafield = e.options[e.selectedIndex].text;

  datafieldIndex =e.selectedIndex;
  
  updateSelectedData();
  chartUpdate();
  
  
  setTitle();
  drawScaleBar();
}
function updateSelectedData(){
  
  if(isPChart)selectPChartData();
  else selectAnnualChartData()
}
function selectPChartData(){

  altitude=Number(climateObj.alt);
  lat=Number(climateObj.location.latitude);
  lon=Number(climateObj.location.longitude);
  atmosPress = getStandardPressure(altitude);
  dataset=[];

  for(var i=0;i<climateObj.hourlyData.length;i++){
    var rh = climateObj.hourlyData[i][rHumidIndex];
    var db = climateObj.hourlyData[i][dbIndex];
      dataset.push([db,rh]);
      
    }

}
function selectAnnualChartData(){
  dataset=[];
  var day=0;
  var hour=0;
 
  for(var i=0;i<climateObj.hourlyData.length;i++){
    var val = climateObj.hourlyData[i][datafieldIndex];
      dataset.push({"day":day,"hour":hour,"field":val});
      hour++;
      if(hour==24){
        hour=0;
        day++;
      }
    }
  units = datafields[datafieldIndex].units;
  maxField = datafields[datafieldIndex].max;
  if(maxField===360){
    units = "units need verification (probabaly radians)";
    maxField=10;
  }
  minField = datafields[datafieldIndex].min;
}
function initPage(){
  setSelectorData("control","Country","countrySelector","countryChanged()",countries,countryIndex);
  setSelectorData("control","City","citySelector","cityChanged()",cities,cityIndex);
  if(!isPChart) setSelectorData("control","Data","dataSelector","dataFieldChanged()",datafields,datafieldIndex);
  dataReading = document.getElementById("tooltip");
}
function getData(){
	climateUrl = '../../data/json/allEPW/'+country+'/'+country+'_'+city+".json";
loading();
	d3.queue()
    .defer(d3.json, climateUrl)
    .await(process);

}
function getMetaData(){
  metaUrl = '../../data/json/allEPW/countrydata.json';

  d3.queue()
    .defer(d3.json, metaUrl)
    .await(processmeta);
}
function processmeta(error,data){
  if (error) throw error;
  console.log(data);

  metaObj =data;
  getCountries();
  getCities();

}
function getCities()
{
  cities=[];
  for(var i=0;i<metaObj.countries.length;i++)
  {
    if(metaObj.countries[i].country==country)
    {
      countryIndex=i;
      cities = metaObj.countries[i].cities;
      for(var j=0;j<metaObj.countries[i].cities.length;j++)
      {
        if(metaObj.countries[i].cities[j]==city){
          cityIndex=j;
        break;}
      }
      break;
    }
  }
}
function getCountries(){
  countries =[];
  for(var i=0;i<metaObj.countries.length;i++){
    countries.push(metaObj.countries[i].country);
  }
}
function parseData(data){
  climateObj=data;
  datafields = climateObj.hourlyDataFields;
  tryMaintainFields();
  getFieldNames();
  if(!isPChart) updateSelector("dataSelector",datafieldnames,datafieldIndex);
  updateSelectedData(); 

}

function process(error,data){
  if (error) throw error;
  console.log(data);
  loaded();
  initPage();
  parseData(data);
  
  initChart();
  
 }
 function getFieldNames(){
  datafieldnames = [];
  for(var i=0;i<datafields.length;i++)
  {
    if(datafields[i].name=="Dry Bulb Temperature") dbIndex=i;
    if(datafields[i].name=="Relative Humidity") rHumidIndex=i;
    datafieldnames.push(datafields[i].name);
  }
 }

var w = 1000;
var h = 800;
var clusters=3;
var countries = ["Colombia","All Tropics"]

function runTool(mapfile,climatedata){
  //called only on page load
      w = document.getElementById("content").clientWidth;
h=w*0.77;
  setMap("../../../data/maps/"+mapfile,-69.5,7.7,2700);
  
  setUpMapping();
  //set up the 3d cluster view
  run3dClusterView("../../../data/classifications/ColombianClustering/"+clusters+"/mesh.txt");
}
function updateControls(){
	updateText("Averaged "+ title +" k-means clustering study: 3D data points {temp, rh, wind}","gridtitle");
	updateText(currentField.description+" "+currentField.units,"scaleTitle");
	//updateSelector("datatypeSelector",datafieldNames,0);
	//updateSelector("classtypeSelector",classificationType,0);
	setMonthSlider();
 	sethorizontalScaleBar();
 	defineScaleBar();

}
function setUpMapping(){
	setTitleGrid(title);
	addLinkToDiv("clustering performance evaluation","control", "performance.html",true);
	//setSelectorData("title", "Select region to display: ", "countrySelector", "countryChange()",countries,0);
	//setSelectorData("control", "Select classification type: ", "classtypeSelector", "classChange()",classificationType,0);
  	//setSelectorData("control", "Select data to display: ", "datatypeSelector", "dataChange()",datafieldNames,5);
	addText("scale","","scaleTitle","h3");
	addText("title","mouse over map and scale bar for detail, use mouse wheel for zoom, left click to pan","","h4");
	addRangeSlider("control","total clusters","clustersSelector","clusterChange()",clusters,15,1,clusters,"slider","h3","");
  	addRangeSlider("control","month","monthSelector","monthChange()",1,12,1,month,"slider","h3","");
  	addText("control","Cell detail:","cellDetail","h4");
  	
 	
}

function toggleMonthSlider(disabled){
	s = document.getElementById("monthSelector");
		s.disabled = disabled;
		month = s.value;
		if(disabled) updateText("dataset is annual","monthvalue"); 
		else updateText(month,"monthvalue");

}
function setMonthSlider(){
	//control the month slider
	// holdridge and KG are annual data so is the annual SD in climate stats
	var datafieldDes = datafieldNames[fieldNum];
	if(currentClassification.indexOf("climate")>-1||currentClassification.indexOf("hudson")>-1) 
 	{
		if(datafieldDes.indexOf("for a year")>-1) toggleMonthSlider(true);
		else toggleMonthSlider(false);
 	}
 	else
 	{

		toggleMonthSlider(true);
 	}
}
function countryChange(){
	var e = document.getElementById('countrySelector');
	maxField = clusters-1;
	switch(e.selectedIndex)
	{
		case 0://colombia 
		//setMap("../../data/maps/COL_adm0CountryBoundary.json",-69.5,7.7,2700);
  		getData("../../data/classifications/ColombianClustering/"+clusters+"/"+clusters+"clusters.json"); 
  		//getClusterMeshData("../../data/classifications/TropicalClustering/"+clusters+"/Colombia/"+"mesh.txt");
		break;
		case 1://tropics
		setMap("../../data/maps/worldTopo.json",18.6,17.8,200);
  		getData("../../data/classifications/TropicalClustering/"+clusters+"/"+clusters+"clusters.json");
  		//getClusterMeshData("../../data/classifications/TropicalClustering/"+clusters+"/mesh.txt");
		break;
	}
	
}
function clusterChange(){
	var e = document.getElementById('clustersSelector');
	clusters = e.value;
	var zone = 0;//document.getElementById('countrySelector');
	maxField = clusters-1;
	switch(zone)
	{
		case 0://colombia 
  		getData("../../../data/classifications/ColombianClustering/"+clusters+"/"+clusters+"clusters.json"); 
  		getClusterMeshData("../../../data/classifications/ColombianClustering/"+clusters+"/mesh.txt");
		break;
		case 1://tropics
  		getData("../../data/classifications/TropicalClustering/"+clusters+"/"+clusters+"clusters.json");
  		//getClusterMeshData("../../data/classifications/TropicalClustering/"+clusters+"/mesh.txt");
		break;
	}
	updateText(clusters,"total clustersvalue");
}
function classChange(){
	var e = document.getElementById('classtypeSelector');
	var s;
	currentClassification = classificationType[e.selectedIndex];
	//control the sliders
	getClassificationFields();
	//update the data field drop down
	updateSelector("datatypeSelector",datafieldNames,0);
	setMonthSlider();
	getCellData();
	dataChange();
	chartUpdate();
}

function defineScaleBar(){
	minField = Number(currentField.min);
	maxField = Number(currentField.max);
	var barlabels=[];

	if(isNaN(minField)||currentClassification.indexOf("hudson")>-1)
	{
		barlabels=currentField.labels;
		minField=0;
	}
	else
	{
		var step =(maxField-minField)/20;
		if(currentField.discreteScale)step =1;
		
		for(var i=minField;i<=maxField;i+=step)
		  {
		    barlabels.push(Math.round(i));
		  }

	}
	updateText(currentField.description+" "+currentField.units,"scaleTitle");
	
	drawScaleBarTextHorizontal(15,barlabels);
	
}
function dataChange()
{
 	var e = document.getElementById('datatypeSelector');
	var d = e.selectedIndex;
	getSelectedDataField(datafieldNames[d]);
	setMonthSlider();
	if(currentField.description.indexOf("colour")>-1)
	{
chartUpdate();
	}
	else
	{
	defineScaleBar();
	chartUpdate();
	}
}
function monthChange(){
	var e = document.getElementById('monthSelector');
	var id = e.getAttribute("id");  
	title =id.substring(0, id.length - 8);
	month = e.value-1;
	updateText(e.value,title+"value");
	chartUpdate();
}

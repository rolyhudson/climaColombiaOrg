
var w = 1200;
var h = 500;
var countries = ["World"]

function runTool(mapfile,climatedata){
  //called only on page load
   w = document.getElementById("content").clientWidth;
h=w*0.77;
  setMap("../../data/maps/"+mapfile,0,0,200);
  getData("../../data/classifications/"+climatedata); 
  setUpMapping();
}
function updateControls(){
	updateText(title,"gridtitle");
	updateText(currentField.description+" "+currentField.units,"scaleTitle");
	updateSelector("datatypeSelector",datafieldNames,0);
	updateSelector("classtypeSelector",classificationType,0);
	setYearSlider();
	setMonthSlider();
 	sethorizontalScaleBar();
 	defineScaleBar();

}
function setUpMapping(){
	setTitleGrid(title);
	setSelectorData("title", "Select region to display: ", "countrySelector", "countryChange()",countries,0);
	setSelectorData("control", "Select classification type: ", "classtypeSelector", "classChange()",classificationType,0);
  	setSelectorData("control", "Select data to display: ", "datatypeSelector", "dataChange()",datafieldNames,0);
	addText("description","","scaleTitle","h3");
	addText("title","WARNING LARGE DATASET - UPDATE AND LOAD TIMES CAN BE SLOW","","h2");
	addLinkToDiv("View Image of World KoppenGieger Classification","title", "../../img/KG.jpg",true);
	addLinkToDiv("View Image of Holdridge Classification","title", "../../img/hold.jpg",true);
	addText("title","mouse over map and scale bar for detail, use mouse left to pan and wheel to zoom","","h4");
  	addRangeSlider("control","year","yearSelector","yearChange()",stYr,endYr,1,1,"slider","h3","");
  	addRangeSlider("control","month","monthSelector","monthChange()",1,12,1,month,"slider","h3","");
 	
}
function setYearSlider(){
	//control the year slider
	//is the data an average data set
	var avI = currentClassification.indexOf("Average");
	if(avI >-1)
	{
		s = document.getElementById("yearSelector");
		s.disabled = true;
		year = s.value;
		updateText("average","yearvalue");
	}
	else
	{
		s =document.getElementById("yearSelector");
		//just in case not set
		s.setAttribute("min",stYr);
    	s.setAttribute("max",endYr);
		s.disabled = false;
		year = s.value;
		updateText(year,"yearvalue");
	}
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
	if(currentClassification.indexOf("climate")>-1) 
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
	switch(e.selectedIndex)
	{
		case 0://colombia "COL_adm0CountryBoundary.json","statsColombiaAverages.json"
		setMap("../../data/maps/COL_adm0CountryBoundary.json",-69.5,7.7,2700);
  		getData("../../data/classifications/colTest.json");
		break;
		case 1://france 
		setMap("../../data/maps/FRA_adm0.json",5,48.204,2700);
  		getData("../../data/classifications/statsFranceAverages.json");
		break;
		case 2://tropics
		setMap("../../data/maps/worldTopo.json",0,15,200);
  		getData("../../data/classifications/worldNoPolesB.json");
		break;
	
	}
	
}
function classChange(){
	var e = document.getElementById('classtypeSelector');
	var s;
	currentClassification = classificationType[e.selectedIndex];
	//control the sliders
	
	setYearSlider();
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

	if(isNaN(minField))
	{
		barlabels=currentField.labels;
		minField=0;
		maxField=barlabels.length;
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
	
	drawScaleBarTextHorizontal(20,barlabels);
	
}
function dataChange()
{
 	var e = document.getElementById('datatypeSelector');
	var d = e.selectedIndex;
	getSelectedDataField(datafieldNames[d]);
	setMonthSlider();
	defineScaleBar();
	chartUpdate();
}

function yearChange(){
	var e = document.getElementById('yearSelector');
	var id = e.getAttribute("id");  
	title =id.substring(0, id.length - 8);
	year = e.value;
	updateText(e.value,title+"value");
	chartUpdate();
}
function monthChange(){
	var e = document.getElementById('monthSelector');
	var id = e.getAttribute("id");  
	title =id.substring(0, id.length - 8);
	month = e.value-1;
	updateText(e.value,title+"value");
	chartUpdate();
}

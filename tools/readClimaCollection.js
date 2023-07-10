var dataset=[];
var grid=[];
var datafields=[];
var datafieldNames=[];
var allData;
var projectedCell=[];
var classificationType=[];
var classificationData;
var stYr;
var endYr;
var title;
var currentClassification;
var currentField;
var year;
var month=0;
var minField;
var maxField;
var fieldNum;
function getData(file)
{
	loading();
	d3.queue()
    .defer(d3.json, file)
    .await(process);
}
function process(error, data)
{
	if (error) throw error;
	loaded();
  	console.log(data);
  	classificationData = data;
	getClassificationTypes();
	year = stYr;
	getClassificationFields(currentClassification);
	getSelectedDataField(datafieldNames[0]);
	getCellData();

	updateControls();
	chartUpdate();
}
function getClassificationFields(){
	datafields=[];
	datafieldNames=[];
	//is the classification an average
	var name = currentClassification;
	if(currentClassification.indexOf("Average")>-1)
	{
		//trim off the average bit
		var avI = currentClassification.indexOf("Average");
		name = currentClassification.substring(0,avI);
	}
	
	
	var allDatafields= classificationData.dataFields;
	for(var i=0;i<allDatafields.length;i++)
	{
		for(var prop in allDatafields[i])
		{
			if(prop.indexOf(name)>-1)
			{
				datafields = allDatafields[i][prop];
		 		for(var j=0;j<datafields.length;j++)
		 		{
		 			datafieldNames.push(datafields[j].description);
		 		}
		 		return;
			}
		}
	 	
	}
}
function getSelectedDataField(selectedField){
	for(var i=0;i<datafields.length;i++){
		if(datafields[i].description===selectedField){
			currentField = datafields[i];
			fieldNum =i;
			break;
		}
	}
	
}
function getClassificationTypes(){
	classificationType=classificationData.classificiationTypes;
	stYr = classificationData.startYear;
	
	endYr = classificationData.endYear;
	title = classificationData.collectionType;
	currentClassification = classificationType[0];

}


function getCellData()
{
	dataset=[];
	var pts = classificationData.gridPoints;
	for(var i=0;i<pts.length;i++){
		var d = pts[i][currentClassification];
		
		dataset.push({lat:pts[i].location.latitude,lon:pts[i].location.longitude,alt:pts[i].alt,data: d});
	}
	
}
function getValueFromCell(d){
	var n;
	var p;
	var yIndex;
	if(currentClassification ==="climateStats") yIndex=year-stYr;
	else yIndex=0;//averages
	switch(currentClassification) {
    case "climateData":
         //year month and fields
         n = d.data[year-stYr][fieldNum][month];
        break;
    case "hudsonVelascoData":
         //year month and fields
         n = d.data[year-stYr][fieldNum][month];
        break;
        case "hudsonVelascoAverage":
         //year month and fields
         if(currentField.description=="altitude")n =d.alt;
         else n = d.data[0][fieldNum][month];
        break;
    case "climateDataAverages":
    	//only one year but months and fields
        n = d.data[0][fieldNum][month];
        break;
    case "climateStats":
    	//only one year but months and fields
        n = getStat(d,fieldNum);
        break;
    case "climateStatsAverages":
    	//only one year but months and fields
        n = getStat(d,fieldNum);
        break;
    case "koppenGeigerData":
       n = d.data[year-stYr][fieldNum];
       break;
    case "holdridgeData":
       n = d.data[year-stYr][fieldNum];
       break;   
    default:
        n = d.data[yIndex][fieldNum];
	}
	
	return n;
}
function getStat(d,fnum)
{
	var n;
	var yIndex;
	if(currentClassification ==="climateStats") yIndex=year-stYr;
	else yIndex=0;//averages
	
	if(Array.isArray(d.data[yIndex][fnum]))//its a sd for the year no months
		{
			n = d.data[yIndex][fnum][Number(month)];
		}
		else
		{
			n=d.data[yIndex][fnum];
		}
	return n;
}
function matchtextToLabels(text){
	for(var i=0;i<currentField.labels.length;i++){
		if(currentField.labels[i].indexOf(text)>-1){
			return i;
			break;
		}
	}
}
function getAllValuesFromCell(d){
	var p =d.data[year-stYr];
	var n;
	var text=[];
	var yIndex;
	if(currentClassification ==="climateStats") yIndex=year-stYr;
	else yIndex=0;//averages
	for(var i=0;i<datafields.length;i++)
	{
		switch(currentClassification) {
    		case "climateData":
         //year month and fields
	         n = d.data[year-stYr][i][month];
	        break;
    		case "climateDataAverages":
	    	//only one year but months and fields
	        n = d.data[0][i][month];
	        break;
		    case "climateStats":
	    	//only one year but months and fields
	        n = getStat(d,i);
	        break;
		    case "climateStatsAverages":
	    	//only one year but months and fields
	        n = getStat(d,i);
	        break;
    		default:
        	n = d.data[yIndex][i];
		}
		var unit = datafields[i].units;
		if(unit==="na") unit="";
		text.push(datafields[i].name+": "+n+" "+unit);
	}
	return text;
}
function loading(){
	document.getElementById("loading").innerHTML="loading data...";
}
function loaded(){
 	document.getElementById("loading").innerHTML="";
}
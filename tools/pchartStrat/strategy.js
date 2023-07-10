var strategies = [];
var strategiesDisplay=[];
var zoneColors = ["MediumSeaGreen","turquoise", "dodgerblue","blue","orchid","purple","SandyBrown","lightsalmon","gold","orange","darkorange","red","darkred" ];
function setStrategy(){
getZones("zones.txt");
getZones("zonesdisplay.txt");
}
function getZones(file){
	if(file.includes("display")){
	d3.queue()
    .defer(d3.text, file)
    .await(parseDisplay);

    
	}
	else{
	d3.queue()
    .defer(d3.text, file)
    .await(parseZones);
    
	}
}
function parseZones(error,data)
{
tableData = d3.csvParseRows(data);
strategies = readZones(tableData);
percentInZone();
}
function parseDisplay(error,data)
{
tableData = d3.csvParseRows(data);
strategiesDisplay = readZones(tableData);
displayOnChart();
}
function readZones(tableData){
	var boundaries = [];
	for(var i=0;i<tableData.length;i++)
	{
		var bound =[];
		var centroid;
		var dbt=0;
			var rh=0;
			var name="";
		for(var j=0;j<tableData[i].length;j++)
		{
			if(j==0)
			{
				//name
				name = tableData[i][j].replace(/ /g,'_');
			}
			else{
				if(j>tableData[i].length-2){
					//last point is centroid
					if(j%2==0){
					//rh
					rh = Number(tableData[i][j]);
					if(rh>100)rh=100;
					satPress= saturationPress(dbt);
					partialPress = partPress(rh,satPress);
					centroid ={"dbt": dbt,"hr":humidtyRatio(atmosPress,partialPress)};
					}
					else{
						//temp
						dbt = Number(tableData[i][j]);
					}
				}
				else{
					if(j%2==0){
					//rh
					rh = Number(tableData[i][j]);
					if(rh>100)rh=100;
					satPress= saturationPress(dbt);
					partialPress = partPress(rh,satPress);
					bound.push({"dbt": dbt,"hr":humidtyRatio(atmosPress,partialPress)});
					}
					else{
						//temp
						dbt = Number(tableData[i][j]);
					}
				}
				
			}
		}
		
		boundaries.push({"name":name,"bound":bound,"color":zoneColors[i],"centroid":centroid});

	}
	return boundaries;
}

function displayOnChart(){
	for(var i=0;i<strategiesDisplay.length;i++){
		d3.selectAll("."+strategiesDisplay[i].name+".strategy").remove();
           svgChart.append("path")
           .data([strategiesDisplay[i].bound])
          	.attr("class", strategiesDisplay[i].name+" strategy")
          	.attr("d", comfBound)
         	.attr("id", "sz"+i)
         	.attr("stroke", strategiesDisplay[i].color)
         	.attr("fill","none")
			.attr("opacity",1)
			.on("mouseover", handleMouseOverStrategy)
    		.on("mouseout", handleMouseOutStrategy);
}
	
}

function handleMouseOverStrategy(d, i) { 
	var name = this.classList[0];
	if(name.includes("HORAS")) return;
	var result = strategies.filter(obj => {
	  return obj.name === name
	})
	var col = result[0].color;
	var objectsToHighlight = document.getElementsByClassName(name);

		for(var i=0;i<objectsToHighlight.length;i++){
			if(objectsToHighlight[i].id=="sztext"){
				objectsToHighlight[i].attributes["font-weight"].value= "bold";
			}
			else{
				//d3.select(this).style("fill", col);
				objectsToHighlight[i].style.fill=col;
				objectsToHighlight[i].attributes["opacity"].value= 0.5;
			}
		}

	var coords = comfortZoneChartCoords([result[0].centroid]);
	svgChart.append("text")
	  .attr("x", coords[0][0])
	  .attr("y", coords[0][1])
	  .attr("text-anchor","middle")
	  .text(name)
	  .attr("class", "mOver sztext");
}

function handleMouseOutStrategy(d, i) {
  var name = this.classList[0];
if(name.includes("HORAS")) return;
var result = strategies.filter(obj => {
  return obj.name === name
})
  var objectsToHighlight = document.getElementsByClassName(name);
		var col = result[0].color;
		for(var i=0;i<objectsToHighlight.length;i++){
			if(objectsToHighlight[i].id=="sztext"){
				objectsToHighlight[i].attributes["font-weight"].value= "200";
			}
			else{
				objectsToHighlight[i].style.fill="none";
				objectsToHighlight[i].attributes["opacity"].value= 1;
			}
		}
  d3.selectAll(".mOver").remove();
}
function percentInZone(){
	var results= [];
	results.push({"hours":"","percent":100,"name":"TOTAL HOURS","color":"black","text":"100% TOTAL hours " +totalHours+ " hrs" });
	for(var i=0;i<strategies.length;i++){
		comfZpoints = comfortZoneChartCoords(strategies[i].bound);
	    comfortHours = hoursInComfortZ(climatePoints, comfZpoints);
	   var percentYr = round(comfortHours/totalHours*100,1);
	   if(percentYr>0){
   		results.push({"hours":comfortHours,"percent":percentYr,"name":strategies[i].name,"color":strategies[i].color,"text":percentYr+"% "+strategies[i].name+" "+comfortHours +"hrs" });
   
 		}
	}
	// sort by value
	results.sort(function (a, b) {
	  return b.percent-a.percent ;
	});

var t =document.getElementsByClassName("comfH ");
		if(t.length>0){
			var parent = t[0].parentNode;
			while(t.length>0){
				parent.removeChild(t[0]);
				
			}
		}
	svgChart.selectAll(".comfH")
		.data(results)
		.enter()
		.append("text")
		.attr("class",function(d){return d.name.replace(/ /g,'_')+" comfH";} )
		.attr("fill", function(d,i){return  d.color;})
		.attr("x", 5)
		.attr("y",function(d,i){return  30+(15*i);})
		.attr("font-weight","200")
		.attr("id", "sztext")
		.on("mouseover", handleMouseOverStrategy)
		.on("mouseout", handleMouseOutStrategy) 
		.text(function(d){return  d.text;});
}
function textPos(d,i){
	return  15+(15*i);
}

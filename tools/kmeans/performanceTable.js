function getEvaluationData(file)
{
	d3.queue()
    .defer(d3.text, file)
    .await(performanceUpdate);
}
function performanceUpdate(error,data){
  var pData = d3.csvParseRows(data);
  var div = document.getElementById("control");
	var tab = document.createElement("table");
	for(var i=0;i<pData.length;i++){

		
		var row = document.createElement("tr");
		var col = "#ffffff";
		//if(Number(pData[i][0])) size = "h4"
		if(pData[i][1]=="means:") col = "#d7e5f4";		
		if(i==0||i==1) col = "#d7e5f4";	

		for(var j=0;j<pData[i].length;j++)
		{
			var cell = document.createElement("td");
			cell.style.backgroundColor = col;
			if(i==0||i==1||j==0||pData[i][j]=="means:"){
				cell.innerHTML = pData[i][j].bold(); 
				
			}
			else {
				
				cell.innerHTML = pData[i][j];
			}
			
			row.appendChild(cell);
		}
 	tab.appendChild(row);
	}

	div.appendChild(tab);
}
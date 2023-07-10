
function getCities(file)
{
	d3.queue()
    .defer(d3.text, file)
    .await(mapCities);
}
function mapCities(error,data){
  var cityData = d3.csvParseRows(data);
  var cityLocations =[];
  for(var i=0;i<cityData.length;i++)
  {
		cityLocations.push({"city":cityData[i][0],"lat":cityData[i][1],"lon":cityData[i][2]});
  }

d3.selectAll(".citys").remove();
  svgChart.selectAll(".citys")
  .data(cityLocations,function(d){return d;})
   .enter()
   .append("text")
    .attr("class", "citys")
   .attr("x", function (d) { return projection([d.lon,d.lat])[0];})
   .attr("y", function (d) { return projection([d.lon,d.lat])[1];})
  .attr("font-size", 12+"px")  
  .text(function (d) { return d.city;})
d3.selectAll(".cityPt").remove();
  svgChart.selectAll("circle")
    .data(cityLocations,function(d){return d;})
    .enter()
    .append("circle")
    .attr("class", "cityPt")
    .attr("cx", function (d) { return projection([d.lon,d.lat])[0]; })
    .attr("cy", function (d) { return projection([d.lon,d.lat])[1]; })
    .attr("r", "3px")
    .attr("fill", "red")

}

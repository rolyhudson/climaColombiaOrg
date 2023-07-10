var svgScaleBar;
var highlightedBlock;
var scaleblocks;
var labelMap =[];
function highlightBlock(color){
  scaleblocks[highlightedBlock].style.fill = "red";
}
function resethighlightBlock(){
  var v = scaleblocks[highlightedBlock].id;
  if(isNaN(v))
  {
  scaleblocks[highlightedBlock].style.fill = getColorSpectral(highlightedBlock);
  }
  else
  {
  scaleblocks[highlightedBlock].style.fill = getColorSpectral(v);
  }
}
function getColorSpectral(t){


if(currentDimType.indexOf("IDEAM")>-1)
{
var cScale = d3.scaleLinear()
 .domain([minField,maxField])
 .range([0,1]);
}
else
{
var cScale = d3.scaleLinear()
 .domain([minField,maxField])
 .range([1, 0]);

}


  return d3.interpolateSpectral(cScale(t));
}

function findBlockInScale(d){
  
  var v = getValueFromCell(d);
  if(isNaN(v))
  {
    for(var i=0;i<scaleblocks.length;i++){
      if(scaleblocks[i].id.indexOf(v)>-1)
      {
        highlightedBlock=i;
        break;
      }
    }
    
  }
  else
  {
    var min = Number(scaleblocks[0].id);
    var range = Number(scaleblocks[1].id)-min;
    var i = Math.ceil((v-min)/range);

    //handle the numeric classificiations
    if(currentField.description.indexOf("Classfication numeric")>-1||currentField.description.indexOf("clustering")>-1){
    i=v;
    }

    highlightedBlock=i;
  }
}
function setScaleBar(){
  svgScaleBar = d3.select("#description")
  .append("svg")
  .attr("width", 300)
  .attr("height", 60)
  .attr("class","svgScaleBar");
}
function setverticalScaleBar(){

   d3.selectAll(".svgScaleBar").remove();
  svgScaleBar = d3.select("#scale")
  .append("svg")

  .attr("width", 250)
  .attr("height", h)
  .attr("class","svgScaleBar");
}
function sethorizontalScaleBar(){

   d3.selectAll(".svgScaleBar").remove();
  svgScaleBar = d3.select("#scale")
  .append("svg")

  .attr("width", w)
  .attr("height", 250)
  .attr("class","svgScaleBar");
}

function defineTextTransform(d,i,blocksize,labelX)
{
var xText = i*blocksize+blocksize/2;
var yText = labelX+blocksize;
return "translate(" + xText + "," + yText + ") rotate(90)";
}
function createLabelMap(labels){
  labelMap =[];
  for(var i=0;i<labels.length;i++)
  {
    var spc = labels[i].indexOf(" ");
    var li = labels[i].indexOf("(");
    var v = labels[i].substring(spc+1);
    labelMap.push({"index":i,"label":labels[i],"t":Number(v)});
  }
  labelMap.sort(function(a,b){return a.t-b.t;});
}
function drawScaleBarText(blocksize,labels){

  createLabelMap(labels)
  
  var barBlocks =labels.length;
  var range =maxField-minField+1;
  var step = range/barBlocks;
  
  var labelData=[];
 
    for(var i=minField;i<=maxField;i+=step)
    {
      labelData.push(i);
    }
  
  
// remove previous
d3.selectAll(".blocks").remove();
//add the new blocks
 var  label = svgScaleBar.selectAll("rect")
  .data(labelData)
   .enter()
    .append("rect")
    .attr("class","blocks")
    .attr("id",function(d,i){return  labelMap[i].index;})
    .attr("x", 0)
      .attr("y", function(d,i){return i*blocksize+blocksize/5;})
      .attr("width", blocksize)
      .attr("height",blocksize)
      .style("fill", function(d) {return getColorSpectral(d);})
      .on("mouseover", handleMouseOverScale)
    .on("mouseout", handleMouseOutScale);
 
      scaleblocks = document.getElementsByClassName("blocks");

  
  var labelX=blocksize*1.5;
// remove previous
var label = svgScaleBar.selectAll(".label").remove();
    
//add the new labels
  label = svgScaleBar.selectAll(".label")
  .data(labelMap)
   .enter()
    .append("text")
    .attr("class","label")
    .attr("x",labelX)
    .attr("y",function(d,i){return i*blocksize+blocksize/2;})
    .attr("dy", ".35em")
    .text(function(d){return d.label;});



}
function handleMouseOverScale(d, i){
  var mapBlocks = document.getElementsByClassName("mapBlocks");
  var cluster = Number(scaleblocks[i].id);
      for(var b=0;b<mapBlocks.length;b++){
        v = Number(mapBlocks[b].id);
          if(v ===cluster){
          mapBlocks[b].style.fill = "red";
          
      }
    }
}
function handleMouseOutScale(d, i){
    var mapBlocks = document.getElementsByClassName("mapBlocks");
    var cluster = Number(scaleblocks[i].id);
    for(var b=0;b<mapBlocks.length;b++){
      var v = Number(mapBlocks[b].id);
      if(v ===cluster){
      mapBlocks[b].style.fill = getColorSpectral(i);
    
    }
  }
  
}
function setScaleBarText(width,height){
  svgScaleBar = d3.select("#description")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class","svgScaleBar");
}

function drawScaleBar(){
  

  var barwidth = 200;
  var barheight = 20;
  var barBlocks =20;
  var blockW =barwidth/barBlocks;
  var range =maxField-minField;
  var step = range/barBlocks;
  
  var labelData=[];
  
  for(var i=minField;i<=maxField;i+=step)
  {
    labelData.push(i);
  }

  // DATA JOIN
 var rects=svgScaleBar.selectAll("rect")
    .data(labelData);
  //ENTER
  rects.enter()
      .append("rect")
      .attr("x", function(d,i){return i*blockW;})
      .attr("y", 0)
      .attr("width", blockW)
      .attr("height", barheight)
      .style("fill", function(d) {return getColorSpectral(d);});
   // EXIT   
  rects.exit().remove();

   var numLabels =4;
  step = range/numLabels;

  var labels=[];
  for(var i=minField;i<=maxField;i+=step)
  {
    labels.push(Math.round(i));
  }
  var labelX=barwidth/(labels.length-1);
// remove previous
var label = svgScaleBar.selectAll(".label").remove();
    
//add the new labels
  label = svgScaleBar.selectAll(".label")
  .data(labels)
   .enter()
    .append("text")
    .attr("class","label")
    .attr("x",function(d, i) { return (i*labelX); })
    .attr("y",function(d,i){return  (barheight+10);})
    .attr("dy", ".35em")
    .text(String);

// DATA JOIN
  var title = svgScaleBar.selectAll(".title")
    .data([datafield+" "+units],function(d){return d;});
  //ENTER
  title.enter()
    .append("text")
    .attr("class","title")
    .attr("x",  function(d, i) { return (i*labelX) ; })
    .attr("y",  function(d, i) { return (barheight+20) ; })
    .attr("dy", ".35em")
    .text(String);

  // EXIT   
  title.exit().remove();

}
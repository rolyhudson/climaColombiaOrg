function setSelector(divID,title,selectorID,onChangeFn,start,end,step,optionSet,classN,style){
	addText(divID,title+":","comTitle",style);
  var control = document.getElementById(divID);
    var x = document.createElement("SELECT");
    x.setAttribute("id", selectorID);
    x.setAttribute("onchange", onChangeFn);
    x.setAttribute("class",classN);
    control.appendChild(x);

    select = document.getElementById(selectorID);

    for(var i=start;i<end;i+=step){
      var opt = document.createElement('option');
      opt.value =round(i,2);
      opt.innerHTML = round(i,2);
      select.appendChild(opt);
    }

    select.value=optionSet;
}
function setSelectorData(div, label, id, functionOnChange, data,optionSet) {
    var control = document.getElementById(div);
    var x = document.createElement("h3");
    var t = document.createTextNode(label+"");
    x.appendChild(t);
    control.appendChild(x);
    var x = document.createElement("SELECT");
    x.setAttribute("id", id);
    x.setAttribute("onchange", functionOnChange);
    control.appendChild(x);

    select = document.getElementById(id);

    for(var i=0;i<data.length;i++){
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = data[i];
      select.appendChild(opt);
    }
    select.value=optionSet;//default to bogota
}
function addRangeSlider(divID,title,selectorID,onChangeFn,start,end,step,optionSet,classN,style,units){


  var control = document.getElementById(divID);
  var p = document.createElement("p");
    var x = document.createElement("INPUT");
    x.setAttribute("type", "range");
    x.setAttribute("id", selectorID);
    x.setAttribute("onchange", onChangeFn);
    x.setAttribute("class",classN);
    x.setAttribute("value",optionSet);
    x.setAttribute("min",start);
    x.setAttribute("max",end);
    x.setAttribute("step",step);
    x.style.width = "100px";
    x.style.height = "10px";
    p.appendChild(x);
    p.appendChild(makeTextID("comTitle"," "+title+": ",style));
    p.appendChild(makeTextID(title+"value",optionSet+" "+units,style));
    
    control.appendChild(p);
   
    
}
function addP(divID){
  var control = document.getElementById(divID);
    var x = document.createElement("p");
    return x;
}
function makeTextID(id,text,style){
  var x = document.createElement(style);
    x.setAttribute("id",id);
    var t = document.createTextNode(text);
    x.appendChild(t);
    return x;
}
function addText(divID,text,id,style){
var control = document.getElementById(divID);
    var x = document.createElement(style);
    x.setAttribute("id",id);
    var t = document.createTextNode(text);
    x.appendChild(t);
    control.appendChild(x);
}
function updateText(text,id){
  var h = document.getElementById(id);
  var t = document.createTextNode(text);
  h.replaceChild(t, h.childNodes[0]);
}
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function cleanDiv(name){
  var div = document.getElementById(name);
  while(div.hasChildNodes()){
    div.removeChild(div.lastChild);
  }
}
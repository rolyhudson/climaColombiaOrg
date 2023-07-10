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
function addLinkToDiv(text,id, href,newTab)
{
  var d = document.getElementById(id);
  var p = document.createElement("p");
  var node = onelineLink(text, href,newTab);
  p.appendChild(node);
  d.appendChild(p);
}
function onelineLink(name, href,newTab)
{
                var link = document.createElement("a");
                link.innerHTML=name;
                link.href = href;
                if(newTab) link.target ="_blank";
  return link;
}
function insertAnchor(div, aname){
  var control = document.getElementById(div);
  var x = document.createElement("a");
  x.setAttribute("name",aname);
  control.appendChild(x);
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

function updateSelector(id,data,optionSet){
  select = document.getElementById(id);
  while (select.options.length>0)
  {
    select.remove(0);
  }
  for(var i=0;i<data.length;i++){
      var opt = document.createElement('option');
      opt.value = i;
      opt.innerHTML = data[i];
      select.appendChild(opt);
    }
    select.value=optionSet;
}

function addRangeSlider(divID,title,selectorID,onChangeFn,start,end,step,optionSet,classN,style,units){

if(units==null) units="";
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
function setTitle(){
  cleanDiv("title");
  var tit = document.getElementById("title");
  var x = document.createElement("h1");

  var t = document.createTextNode("Annual graph for "+datafield+" in "+city+" "+country);
  x.appendChild(t);
  tit.appendChild(x);
}
function setTitleGrid(title){
cleanDiv("title");
  var tit = document.getElementById("title");
  var x = document.createElement("h1");
x.setAttribute("id","gridtitle");
  var t = document.createTextNode(title);
  x.appendChild(t);
  tit.appendChild(x);
}
function cleanDiv(name){
  var div = document.getElementById(name);
  while(div.hasChildNodes()){
    div.removeChild(div.lastChild);
  }
}

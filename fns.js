var mainimgHeight=300;
var contentHeight=300;
var menuHFactor=10;
var rootPath = "http://lacunae.io/Clima-Colombia/climaColombiaOrg";
function makePage(){
window.addEventListener('resize', resize);
setAnalytics();
makeTitle("header");
makeMenu("menu");
makeFooter();
setContentTopMargin();
//update
}
function resize()
{
	setContentTopMargin();
}

function setContentTopMargin()
{
	var content =document.getElementById("content");
	var height = document.getElementById('header').clientHeight;
	content.style.marginTop = height+"px";
	return height;
}
function setAnalytics()
{
 (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-124217251-1', 'auto');
  ga('send', 'pageview');
}
function  makeMenu(id)
{
	var content =document.getElementById(id);
	var contentsection = makeSection();
	contentsection.style.backgroundColor = "white";
	var p = makeContentElement("tools","",menuHFactor,"tools","h4","third","/tools.html",true);
	var a = makeContentElement("data","",menuHFactor,"datos","h4","third","/datos.html",true);
	var c = makeContentElement("resources","",menuHFactor,"recursos","h4","third","/recursos.html",true);
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
    content.appendChild(contentsection);
}
function makeSection()
{
	var ele = document.createElement("div");
	ele.className="section group";
	return ele;
}
function makeContentElement(text,image,scale, textid,titlesize,colType,href,pos,ismenu)
{
	
	if(colType==="third")var contentCol = makeContentCol("col span_1_of_3",mainimgHeight/scale,"");
	if(colType==="full")var contentCol= makeContentCol("col span_3_of_3",mainimgHeight/scale,"");
	if(colType==="twothirds")var contentCol= makeContentCol("col span_2_of_3",mainimgHeight/scale,"");
	if(image!=""){
	contentCol.style.backgroundImage = "url("+rootPath + image+")";
	}
    var titlediv = makeFloatTextDiv(text,textid,titlesize,href,"",pos,ismenu);
    
    contentCol.appendChild(titlediv);
    
    return contentCol;
}
function logoElement(text,scale, textid,titlesize,colType,href)
{
	var contentCol= makeContentCol("col span_1_of_3_logo",mainimgHeight/scale,"");
	var titlediv = makeTextLink(text, href,titlesize);
    
    contentCol.appendChild(titlediv);
    
    return contentCol;
}

function makeDownLoadBtn()
{
	var btn = document.createElement("BUTTON");
      var t = document.createTextNode("DOWNLOAD ZIP"); 
      btn.appendChild(t)
      btn.onclick =function(){ location.href=rootPath+"/data/epw/rc3_0/rc3_0.zip"};      // Create a text node
      
	return btn;
}
function downloadEPWZip(){
//location.href="/data/epw/rc1_0/rc1_0.zip";
  // $.ajax({
  //     url: "/data/epw/rc1_0/rc1_0.zip",
  //     success: download.bind(true, "text/html", "climaColombiaEPWrc1_0.zip")
  //   });
  
}
function makeTextLink(text, href,size)
{
	
	var t = document.createElement(size);
	var node = onelineLink(text, href);
	t.appendChild(node);
	return t;
}
function makeText(text,size){
	var t = document.createElement(size);
	var node = document.createTextNode(text);
	t.appendChild(node);
	return t;
}
function makeContentCol(classType,maxH,id)
{
	var contentCol = document.createElement("div");
	contentCol.className=classType;
	contentCol.style.height = maxH+"px";
	if(id!="")contentCol.id=id;
	return contentCol;
}
function makeFloatTextDiv(text,textid,titlesize, href,photo,ismenu)
{
	var ele = document.createElement("div");

	ele.className="floatText";
	if(ismenu){
		ele.className="menuText";
		if(text=="data") ele.className="menuTextCentre";
	    if(text=="resources") ele.className="menuTextRight";
	}
	ele.id = textid;
	if(photo!=""){var pic = imageNode(photo);
	ele.appendChild(pic);
	}
	var title = document.createElement(titlesize);
    if(href=="") var node = document.createTextNode(text);
    else var node = onelineLink(text, href);
    title.appendChild(node);

    ele.appendChild(title);
	return ele;
}

function onelineLink(name, href)
{
                var link = document.createElement("a");
                link.innerHTML=name;
                if(href.indexOf('#') >-1 || href.indexOf('http')>-1)
                    link.href = href;
                else
                    link.href = rootPath + href;
	return link;
}
function makeFooter()
{
	var content =document.getElementById("footer");
	var contentsection = makeSection();
	var p = makeContentElement("04 08 2019 info[a]clima-colombia.org","",6,"date","h4","full","");
	contentsection.appendChild(p);
    content.appendChild(contentsection);
}
function makeTitle(id)
{
	var content =document.getElementById(id);
	var contentsection = makeSection();
	contentsection.style.backgroundColor="white";
	var p = makeContentElement("clima-Colombia","",menuHFactor,"pagetitle","h3","full","/index.html","l");
	contentsection.appendChild(p);
	content.insertBefore(contentsection,content.firstChild)
    
}
function herramPage(){
	var content =document.getElementById("content");
setContentTopMargin();
    var contentsection = makeSection();
	var p = makeContentElement("psychrometric chart","/img/t10.jpg",1.5,"pchart","h2","third","/tools/pchart");
	var a = makeContentElement("annual 2d chart","/img/t1.jpg",1.5,"2dchart","h2","third","/tools/annual2d");
	var c = makeContentElement("annual 3d chart","/img/t12.jpg",1.5,"3dchart","h2","third","/tools/annual3d");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
    content.appendChild(contentsection);


var contentsection = makeSection();
	var p = makeContentElement("Gridded monthly data, climate / altitude / comfort for Colombia","/img/t28.jpg",1.5,"gridded1","h2","third","/tools/monthlygrid");
	var a = makeContentElement("Gridded, bivariate monthly data, climate / altitude / comfort for Colombia","/img/t25.jpg",1.5,"gridded2","h2","third","/tools/bivariategrid");
	var c = makeContentElement("climaJSON standard for online climatic data","/img/t16.jpg",1.5,"clima","h2","third","/tools/climaschema");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
content.appendChild(contentsection);

var contentsection = makeSection();
	var p = makeContentElement("References, sources and legal",selectRandomImage(),1.5,"refs","h2","third","/tools/refs/refs.html");
	var a = makeContentElement("Access to climaJSON versions of all *.epw",selectRandomImage(),1.5,"climajson","h2","third","/data/json/allEPW");
	var c = makeContentElement("Map of meteorological stations in Colombia","img/t30.jpg",1.5,"map","h2","third","/tools/colstations");
	
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
    content.appendChild(contentsection);

var contentsection = makeSection();
	var p = makeContentElement("Monthly averages for Colombia 2000 a 2009",selectRandomImage(),1.5,"refs","h2","third","/tools/colaverages");
	var a = makeContentElement("Global climate classification","/img/t35.jpg",1.5,"world","h2","third","/tools/worldclass");
	var c = makeContentElement("Colombian climate classification",selectRandomImage(),1.5,"wcolclass","h2","third","/tools/colclass");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
    content.appendChild(contentsection);

var contentsection = makeSection();
	var c = makeContentElement("k-means clustering with climate",selectRandomImage(),1.5,"kmeans","h2","third","/tools/kmeans");
	var p = makeContentElement("psychrometric chart with design strategies","/img/t10.jpg",1.5,"pchart","h2","third","/tools/pchartStrat");
	contentsection.appendChild(c);
	contentsection.appendChild(p);
	content.appendChild(contentsection);
}
function makekmeansPage(){

	var content =document.getElementById("content");
setContentTopMargin();
    var contentsection = makeSection();
	var p = makeContentElement("Visualisation of base data","/img/t26.jpg",1.5,"basedata","h2","third","/tools/kmeans/basedata");
	var a = makeContentElement("1D clustering with comfort indices and average annual data","/img/t27.jpg",1.5,"1dannual","h2","third","/tools/kmeans/annual1d");
	var c = makeContentElement("1D clustering with comfort indices and average monthly data","/img/t28.jpg",1.5,"2dannual","h2","third","/tools/kmeans/monthly1d");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
    content.appendChild(contentsection);


var contentsection = makeSection();
	var p = makeContentElement("3D clustering {temp, hr, viento} and average annual data","/img/t29.jpg",1.5,"gridded1","h2","third","/tools/kmeans/annual3d");
	var a = makeContentElement("3D clustering {temp, hr, viento} and average monthly data","/img/t30.jpg",1.5,"gridded2","h2","third","/tools/kmeans/monthly3d");
	
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	
content.appendChild(contentsection);

}
function mainPageLanding(){
	var content =document.getElementById("content");
	//set top margin
	var headerh = setContentTopMargin();
	var contentsection = makeSection();
	var contentCol = makeContentCol("col span_3_of_3",window.innerHeight-headerh,"");
	contentCol.style.backgroundImage = "url('img/bg2.jpg')";

	var titlediv = makeFloatTextDiv("clima-Colombia","title","h1","","","l");
    titlediv.style.top = window.innerHeight*0.25+"px";
    contentCol.appendChild(titlediv);

    var subtitlediv = makeFloatTextDiv("Climate driven building design and construction in the tropics;","subtitle","h2","","");
    subtitlediv.style.top = window.innerHeight*0.35+"px";
    contentCol.appendChild(subtitlediv);

	var basetitlediv = makeFloatTextDiv("Tools and strategies to improve human comfort in Colombia","subtitle","h4","","");
    basetitlediv.style.top = window.innerHeight*0.8+"px";
    contentCol.appendChild(basetitlediv);

    var downarrow = document.createElement("h1");
    var node = document.createTextNode('\u25BD');
    downarrow.appendChild(node);
	downarrow.style.textAlign ="center";
    var d = document.createElement("div");
    d.appendChild(downarrow);
    d.style.width ="100%";
    d.style.margin = "auto";
    d.style.bottom =0;
    d.style.position = "absolute";
    contentCol.appendChild(d);
    content.appendChild(contentCol);
}
function mainPageSocios(){
	var contentsection = makeSection();
	var a = makeContentElement("partners:","",6,"partners","h1","full","");
	contentsection.appendChild(a);
	content.appendChild(contentsection);

	var contentsection = makeSection();
	var p = logoElement("",3,"Universidad Piloto de Colombia","h4","third","http://www.unipiloto.edu.co/");
	var a = logoElement("",3,"University of Bath","h4","third","http://www.bath.ac.uk/");
	var c = logoElement("",3,"Royal Academy of Engineering","h4","third","https://www.raeng.org.uk/");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
	//add logos
	insertImageAsLink("logos/piloto.png","http://www.unipiloto.edu.co/",p);
	insertImageAsLink("logos/logo.svg","http://www.bath.ac.uk/",a);
	insertImageAsLink("logos/YoE-Logo.svg","https://www.raeng.org.uk/",c);
	
	content.appendChild(contentsection);

	var contentsection = makeSection();
	var p = logoElement("",3,"IDEAM","h4","third","http://www.ideam.gov.co/");
	var a = logoElement("",3,"BURO HAPPOLD ENGINEERING","h4","third","https://www.burohappold.com/");
	var c = logoElement("",3,"Lacunae","h4","third","http://www.lacunae.io");
	contentsection.appendChild(p);
	contentsection.appendChild(a);
	contentsection.appendChild(c);
	//add logos
	insertImageAsLink("logos/IDEAM.jpg","http://www.ideam.gov.co/",p);
	insertImageAsLink("logos/bh.jpg","https://www.burohappold.com/",a);
	insertImageAsLink("logos/lacunae.jpg","http://www.lacunae.io",c);
	
	content.appendChild(contentsection);
}
function mainPageAcerca(){
var contentsection = makeSection();
	var a = makeContentElement("about:","",6,"acerca","h1","full","");
	contentsection.appendChild(a);
	content.appendChild(contentsection);

	content.appendChild(contentsection);

	var contentsection = makeSection();
	var p = makeContentCol("col span_3_of_3",mainimgHeight,"");
	//var a = makeContentElement("herramienta presentada","",2,"herramienta presentada","h5","third","toollink");
	contentsection.appendChild(p);
	//contentsection.appendChild(a);
	addParagraphToDiv(p,acercatext[0]);
	addParagraphToDiv(p,acercatext[1]);
	addParagraphToDiv(p,acercatext[2]);
	content.appendChild(contentsection);
}
function mainPageEquipo(){
	var contentsection = makeSection();
	var a = makeContentElement("team:","",6,"equipo","h1","full","");
	contentsection.appendChild(a);
	var p = makeContentCol("col span_3_of_3",mainimgHeight,"");
	//var a = makeContentElement("herramienta presentada","",2,"herramienta presentada","h5","third","toollink");
	contentsection.appendChild(p);
	//contentsection.appendChild(a);
	addParagraphToDiv(p,"Roland Hudson (Lacunae), Shrikant Sharma (Buro Happold), Paul Shepherd (University of Bath), Rodrigo Velasco (Universidad Piloto)");
	
	
	contentsection.appendChild(p);
	content.appendChild(contentsection);
}
function makeFrontPage()
{
	mainPageLanding();
	mainPageSocios();
    mainPageAcerca();
	mainPageEquipo();
}
function insertImageAsLink(img,web,div)
{
	var link = document.createElement("a");
	link.href = web;
	var x = document.createElement("IMG");
	x.src = img;
	link.appendChild(x);
	div.appendChild(link);
}
function imageNode(image){
	var node = document.createElement("img");
	node.src = image;
	
	return node;
}
function addImageToDiv(image,id)
{
	var im = imageNode(image);
	var d = document.getElementById(id);
	d.appendChild(im);
}
function addParagraphToDiv(div,text)
{
	
	var p = document.createElement("p");
	var node = document.createTextNode(text);
	p.appendChild(node);
	div.appendChild(p);
}
function selectRandomImage()
{
var n = getRandomInt(1,35);
var i = "/img/t"+n+".jpg";
return i;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getDisclaimerData(file)
{
	d3.queue()
    .defer(d3.text, file)
    .await(addDisclaimerText);
}
function addDisclaimerText(error,data)
{
tableData = d3.csvParseRows(data);
var div = document.getElementById("copyright");
for(var i=0;i<tableData.length;i++)
{
	div.appendChild(makeText(tableData[i],"p"));
}
}
function makeRefsPage(){

	var content =document.getElementById("content");
	
	var headerh = setContentTopMargin();
	var contentsection = makeSection();	
	var contentCol = makeContentCol("col span_1_of_1",mainimgHeight/2,"pagetitle");
	contentCol.appendChild(makeText("Licence, legal, references and data sources","h1"));
	contentsection.appendChild(contentCol);
	content.appendChild(contentsection);

    var contentsection = makeSection();
    var contentCol = makeContentCol("col span_1_of_1",mainimgHeight/2,"licence");
    contentCol.appendChild(makeText("Licence","h3"));
	contentCol.appendChild(makeTextLink("clima-colombia.org is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License",
		"https://creativecommons.org/licenses/by-sa/4.0/","p"));
	
	contentsection.appendChild(contentCol);

    content.appendChild(contentsection);
    var contentsection = makeSection();
    var contentCol = makeContentCol("col span_1_of_1",mainimgHeight,"copyright");
    contentCol.appendChild(makeText("DATA DISCLAIMERS AND COPYRIGHT","h3"));
	
	getDisclaimerData("disclaimer.txt");
	contentsection.appendChild(contentCol);

    content.appendChild(contentsection);

    var contentsection = makeSection();
    var contentCol = makeContentCol("col span_1_of_1",mainimgHeight,"refs");
	contentCol.appendChild(makeText("References","h3"));
	contentCol.appendChild(makeText("Ren, H.S., 2004. Construction of a generalized psychrometric chart for different pressures. International Journal of Mechanical Engineering Education, 32(3), pp.212-222.","p"));
	contentCol.appendChild(makeText("Stull, R., 2016. Practical Meteorology: an algebra based survey of atmospheric science. BC Campus.","p"));
	contentCol.appendChild(makeText("ISO 7730:2005 - Ergonomics of the thermal environment","p"));
	contentCol.appendChild(makeTextLink("Hoyt Tyler, Schiavon Stefano, Piccioli Alberto, Moon Dustin, and Steinfeld Kyle, 2013, CBE Thermal Comfort Tool. Center for the Built Environment, University of California Berkeley","http://comfort.cbe.berkeley.edu/","p"));
    
    contentCol.appendChild(makeTextLink("ThreeJS","https://threejs.org/","p"));
	contentCol.appendChild(makeTextLink("D3.js","https://d3js.org/","p"));
    
    contentsection.appendChild(contentCol);
    content.appendChild(contentsection);

    var contentsection = makeSection();

	var contentCol = makeContentCol("col span_1_of_1",mainimgHeight,"datos");
	contentCol.appendChild(makeText("Data sources","h3"));
    content.appendChild(contentsection);
    contentCol.appendChild(makeTextLink("GADM database of Global Administrative Areas","http://www.gadm.org/","p"));
    contentCol.appendChild(makeTextLink("CRU-TS v3.10.01 Historic Climate Database","http://www.cgiar-csi.org/data/uea-cru-ts-v3-10-01-historic-climate-database","p"));
    contentCol.appendChild(makeTextLink("SRTM 90m Digital Elevation Database v4.1","http://www.cgiar-csi.org/data/srtm-90m-digital-elevation-database-v4-1","p"));
    contentCol.appendChild(makeTextLink("EnergyPlus Weather Files","https://energyplus.net/weather","p"));
    contentCol.appendChild(makeTextLink("EnergyPlus Weather Files in climaJSON - the new standard for online interoperable climate data","/data/json/allEPW","p"));
    contentCol.appendChild(makeTextLink("climate.onebuilding.org","http://climate.onebuilding.org/","p"));
    contentCol.appendChild(makeTextLink("climaJSON format specifcation","/tools/climaschema/","p"));
    contentCol.appendChild(makeTextLink("Integrated Surface Database (ISD)","https://www.ncdc.noaa.gov/isd","p"));
	contentsection.appendChild(contentCol);
}
function addLinkToFloatText(text,id, href)
{
	var d = document.getElementById(id);
	var p = document.createElement("p");
	var node = onelineLink(text, href);
	p.appendChild(node);
	d.appendChild(p);
}
function addParagraphToFloatText(text,id)
{
	var d = document.getElementById(id);
	var p = document.createElement("p");
	var t = document.createTextNode(text);
	p.appendChild(t);
	d.appendChild(p);
}
function makeRecursosPage(){
	var content =document.getElementById("content");
	
	var headerh = setContentTopMargin();
	var contentsection = makeSection();	
	var contentCol = makeContentCol("col span_1_of_1",mainimgHeight/4,"pagetitle");
	contentCol.appendChild(makeText("Resources","h1"));
	contentsection.appendChild(contentCol);
	content.appendChild(contentsection);

    var contentsection = makeSection();
    var contentCol = makeContentCol("col span_1_of_1",mainimgHeight,"copyright");
    contentCol.appendChild(makeText("Bibliography:","h3"));
	contentCol.appendChild(makeTextLink("Materials, construction systems and energy efficiency","/materials.html","p"));
	contentCol.appendChild(makeTextLink("Climate","/clima.html","p"));
	contentCol.appendChild(makeTextLink("Comfort","/confort.html","p"));
	contentCol.appendChild(makeTextLink("Green envelopes","/envolVerde.html","p"));
	contentCol.appendChild(makeTextLink("Design and evaluation","/disenoEval.html","p"));
	contentCol.appendChild(makeTextLink("Policy and theory","/politTheoria.html","p"));
	contentsection.appendChild(contentCol);

    content.appendChild(contentsection);
	
}

function makeResourcePage(fileCSV){
	var content =document.getElementById("content");
	var headerh = setContentTopMargin();
	
	var pageName = fileCSV.substring(8,fileCSV.indexOf("."));
    

	var contentsection = makeSection();
	var div = document.createElement("div");
	div.className="col span_3_of_3";
	div.id = "refs";
	var title = document.createElement("h3");
	title.innerHTML = "Bibliography for "+pageName+":";
 	div.appendChild(title);
	contentsection.appendChild(div);
    content.appendChild(contentsection); 

	getRefData(rootPath+fileCSV);


}
function writerefs(error,data)
{
tableData = d3.csvParseRows(data);
for(var i=0;i<tableData.length;i++)
{
	if(tableData[i][1].indexOf("http")>-1)
	{
		addLinkToFloatText(tableData[i][0],"refs",tableData[i][1]);
	}
	else
	{
		addParagraphToFloatText(tableData[i][0],"refs");
	}
}
}
function getRefData(file)
{
	d3.queue()
    .defer(d3.text, file)
    .await(writerefs);
}
function makeDataPage()
{

var content =document.getElementById("content");
var contentsection = makeSection();	
	var contentCol = makeContentCol("col span_1_of_1",mainimgHeight*1.5,"rc3");
	contentCol.appendChild(makeText("release candidate rc3.0","h1"));
	contentsection.appendChild(contentCol);
    
	contentCol.appendChild(makeDownLoadBtn());
	contentCol.appendChild(makeTextLink("Go to map to download individual city files.","#MAP"));
	contentCol.appendChild(makeText("The *.epw files were generated using the clima-colombia.org SynthYear™ synthetic year method that is designed to function with the quality of data availble in Colombia.","p"));
    contentCol.appendChild(makeText("The clima-colombia.org SynthYear™ is adapted from the published TMY (typical meteorological year).","p"));
    contentCol.appendChild(makeText("Raw data is from Colombia's IDEAM (Instituto de Hidrología, Meteorología y Estudios Ambientales) comprised of 10 and 60 minute readings for surface temperature, relative humidity, wind direction, wind speed, precipitation and global horizontal radiation.","p")); 
    contentCol.appendChild(makeText("Gaps in this base data are filled with data from NOAA's (National Oceanic and Atmospheric Administration) integrated surface database (ISD).","p"));
    contentCol.appendChild(makeText("From these values the following derived variables are calculated : dew point temperature, extra-terrestrial horizontal radiation, direct horizontal radiation, diffuse horizontal radiation,","p"));
	contentCol.appendChild(makeText("For each city, the clima-colombia.org SynthYear™ data is synthesised  using a data from stations within a 50 km radius and +- 100m of altitude of the city. Should insufficent data exist in this range, the horizontal limits are expanded to include stations within the same climatic and geographical region.","p"));
    
    contentCol.appendChild(makeTextLink("Graphic summaries that show the fields calculated using clima-colombia.org SynthYear™ synthetic year method for each city are avaliable here.","/data/epw/rc3_0/graphs/rc3GraphSummary.zip","p"));
    
	contentCol.appendChild(makeText("The approach uses emprical data, rather than simulated data and is designed to more accurately reflect the tropical conditions in Colombia.","p")); 
    contentCol.appendChild(makeText("Remaining fields required to complete the *.eow file are taken from the closest city in the climate.onebuilding.org *.epw dataset","p"));
    contentCol.appendChild(makeTextLink("Click here to see a map of stations associated with each city.","/tools/cityGroups","p"));
    contentCol.appendChild(makeText("The clima-colombia.org SynthYear™ method is in constant review and the data is provided to the end users of the Service 'as is'.","p"));
	contentCol.appendChild(makeTextLink("All users should revise the DATA DISCLAIMERS AND COPYRIGHT before use.","/tools/refs/refs.html","p"));
	
	contentCol.appendChild(makeText("Send comments, questions, requests and bug reports to: info[at]clima-colombia.org","p"));
	content.insertBefore(contentsection, content.firstChild);
	
}
var acercatext = ["climaColombia is a project for the construction and dissemination of climatic data linked to the performance of buildings in Colombia.The project is born from the research \"Climate driven building design and construction in the tropics; Tools and strategies to improve human comfort in Colombia\" sponsored by the Royal Academy of Engineering, and developed by Universidad Piloto de Colombia and the University of Bath in collaboration with Lacunae ltd and Buro Happold, using data from the IDEAM.",
"This site includes three sections:\"Tools\" that contains online display engines for typical hourly data of major cities in the country, as well as monthly averages recorded and new ways to classify them according to comfort parameters. \"Data\" includes archives of typical years for the main cities of the country, generated from historical data obtained from the IDEAM, to be used within common environmental simulation engines. \"Resources\" provides links to academic publications are found on related topics." ,
"With the aim of giving continuity and growth to the development carried out so far, the project will also involve the formation of a knowledge network with representatives of academic, professional and governmental entities, including IDEAM, SCA and local universities."];
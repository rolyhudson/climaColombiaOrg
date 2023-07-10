//globals
		var bigscreen;//responsive controller to determine when viewed on smaller screens
		
		//standard threejs variables
		var container3d;
		var camera, scene, renderer,controls;
		//special fit view variables
		var camDist;
		var fov=25;
		var sceneBSCenter = new THREE.Vector3();
		var sceneBSRadius;
		var model;
    var xScale=10;
    var yScale = 40;
    
    var zMin = 20, zMax=800;

    
    var raycaster;
    var mouse = new THREE.Vector2();
    var intersection = null;
    
    var mouseX,mouseY;
    var dataReading;
function getZValue(z){
  
var zScale = d3.scaleLinear()
    .domain([minField, maxField])
    .range([zMin, zMax]);
return zScale(z);
}
function getFieldFromZ(z){
  var zScale = d3.scaleLinear()
    .domain([zMin, zMax])
    .range([minField, maxField]);
return zScale(z);
}
function timeset(hour){
  if(hour<12) return hour+"am";
  if(hour===0)return "midnight";
  if(hour===12) return "midday";
  if(hour>12) return hour-12+"pm";
  }

function runChart(){
	setTitle();
  getMetaData();
  getData();
}

function chartUpdate(){
  scene.remove( model );
  buildMesh();
}
function initChart()
{

	scene = new THREE.Scene();
  document.getElementById("content").clientWidth;
	setRenderer(document.getElementById("content").clientWidth,document.getElementById("content").clientWidth*0.625);
	addBasicLighting();
	//temp camera while model loads
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000);
	//camera.position.set(0,0,500);
	controls = new THREE.OrbitControls( camera, renderer.domElement );


  buildMesh();
  //
  setCameraToLookAtMyObj(model.geometry.vertices,fov,0.35,"persp");
  addGrid(xScale,yScale);
  addLabels();
  setScaleBar();
  drawScaleBar();
	//once we have geometry clear loading dialogue
	
	//check animationtype
	getscreendims();

  
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 0.1;
	window.addEventListener( 'resize', onWindowResize, false );
  var chartspce = document.getElementById("container3d");
  chartspce.addEventListener( 'mousemove', onDocumentMouseMove, false );
	animate();
	
}
function onDocumentMouseMove( event ) {
  var chartspce = document.getElementById("container3d");
  var yShift = chartspce.offsetTop;
  var xShift = chartspce.offsetLeft;
  var width = chartspce.clientWidth;
  var height = chartspce.clientHeight;
  mouseX=event.clientX;
  mouseY=event.clientY;
        event.preventDefault();
        mouse.x = ( (event.clientX-xShift) / width ) * 2 - 1;
        mouse.y = - ( (event.clientY-yShift) / height ) * 2 + 1;
      }
function animate() 
{
	requestAnimationFrame( animate );
	render();
}

function render() 
{
	
	//rotate the object here?
	//model.rotation.y+=0.00000;
  
  
  setTooltip();
  renderer.render( scene, camera );
}
function getClosestVertex(inter){
  var p = new THREE.Vector3(inter.point.x,inter.point.y,inter.point.z);
  var vIndex = [inter.face.a,inter.face.b,inter.face.c]; 
  var corner;
  var dist;
  var closestV;
  var closestD=100000000;
  for(var i=0;i<3;i++){
    corner= new THREE.Vector3(model.geometry.vertices[vIndex[i]].x,model.geometry.vertices[vIndex[i]].y,model.geometry.vertices[vIndex[i]].z);
    dist = p.distanceTo(corner);
    if(dist<closestD){
      closestD=dist;
      closestV =i;
    }
  }
  return vIndex[closestV];
}
function setTooltip(){
  raycaster.setFromCamera( mouse, camera );
  var intersections = raycaster.intersectObjects( scene.children );
  
  if(intersections.length>0){
    dataReading.style.display = "inline";
     if(intersections[ 0 ].object.name ==="chart"){
      var corner= getClosestVertex(intersections[ 0 ]);
      var dataout = Math.round(getFieldFromZ(model.geometry.vertices[corner].y));
      var day = Math.round(model.geometry.vertices[corner].x/xScale);
      var hour = Math.abs(model.geometry.vertices[corner].z/yScale);
      
      dataReading.innerHTML = dataout+units+" "+ datafield+" at " +timeset(hour)+" on day "+day;
      dataReading.style.left =mouseX+"px";
      dataReading.style.top =mouseY+"px";
      //console.log(day+"_"+hour);
     }
   }
  else{
  dataReading.style.display = "none";
  }
}

function addGrid(xScale,yScale){
// grid
        
        var geometry = new THREE.Geometry();
        
        //x axis
        geometry.vertices.push( new THREE.Vector3( -yScale, 0, 23*yScale ) );
          geometry.vertices.push( new THREE.Vector3( 365*xScale, 0, 23*yScale ) );
        //y axis
          geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
          geometry.vertices.push( new THREE.Vector3( 0, 0, 24*yScale ) );

        var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.1, transparent: true } );
        var line = new THREE.LineSegments( geometry, material );
        
        
        scene.add( line );
        //
}
function addLabels(){
 var loader = new THREE.FontLoader();
  var label;
  var text; 
        loader.load(
          // resource URL
          '../helvetiker_regular.typeface.json',
          // Function when resource is loaded
          function ( font) {
            // do something with the font
            console.log( 'font loaded' );
            for ( var i = 0; i <=364; i +=50 ) {
              if(i==0) text="Day "+i;
              else text = i; 
              label = createText(text,font,20,0,i*xScale,0,24*yScale,0,0,0);
              scene.add(label);
          }
          for(var j=0;j<=23;j+=5){
            
              if(j==0) text="Hour "+j;
              else text = j;
              label = createText(text,font,20,0,-yScale,0,(j*yScale),0,0,0);
              scene.add(label);
          }
        });

}

function buildMesh(jsonModelfile)
{
	
var geom = new THREE.Geometry(); 

  for(var i=0;i<dataset.length;i++){

  	geom.vertices.push(new THREE.Vector3(dataset[i].day*xScale,getZValue(dataset[i].field),dataset[i].hour*yScale));
   
    
  }

  var fCount=0;
  var c1,c2,c3,c4;
  for(var i=0;i<dataset.length;i++){//
  	var d = dataset[i].day;
  	var h = dataset[i].hour;
  	if(h===23)continue;
  	if(d===364)break;
    c1 = getColorSpectral(dataset[i].field);
    c2 = getColorSpectral(dataset[i+1].field);
    c3 = getColorSpectral(dataset[i+25].field);
    c4 = getColorSpectral(dataset[i+24].field);
  	geom.faces.push( new THREE.Face3(i,i+1 ,i+25) );
    geom.faces[fCount].vertexColors[0] = new THREE.Color(c1);
    geom.faces[fCount].vertexColors[1] = new THREE.Color(c2);
    geom.faces[fCount].vertexColors[2] = new THREE.Color(c3);
    fCount++;
  	geom.faces.push( new THREE.Face3(i,i+25,i+24) );
    geom.faces[fCount].vertexColors[0] = new THREE.Color(c1);
    geom.faces[fCount].vertexColors[1] = new THREE.Color(c3);
    geom.faces[fCount].vertexColors[2] = new THREE.Color(c4);
    fCount++;
  }

  var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
  material.side  = THREE.DoubleSide;
  model = new THREE.Mesh( geom, material );
  model.name = "chart";
  //model.rotation.x = -0.5*Math.PI;
  scene.add(model);


	//var edges = showMeshEdges(model,0x000000);
  //scene.add(edges);
	

}


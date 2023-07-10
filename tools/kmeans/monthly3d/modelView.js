//globals
	var bigscreen;//responsive controller to determine when viewed on smaller screens
	var meshNames =[];
	//standard threejs variables
	var container;
	var camera, scene, renderer,controls;
	//special fit view variables
	var camDist;
	var fov=20;
	var sceneBSCenter = new THREE.Vector3();
	var sceneBSRadius;
	var model;
    var xScale=2;
    var yScale = 1;
    
    var zMin = 20, zMax=800;

    var dataReading;


function run3dClusterView(file){
//called when page loads once only
minField=0;
maxField=2;
	initClusterView();
  	getClusterMeshData(file);
}
function getClusterMeshData(file)
{
	d3.queue()
    .defer(d3.text, file)
    .await(cluster3dUpdate);
}
function cluster3dUpdate(error,data){
  for(var i=0;i<meshNames.length;i++)
	{
		scene.remove( scene.getObjectByName(meshNames[i]));
	}
  buildMesh(data);

}
function removeClusterMeshes(){
	for(var i=0;i<meshNames.length;i++)
	{
		scene.remove( scene.getObjectByName(meshNames[i]));
	}
}
function initClusterView()
{
	scene = new THREE.Scene();
	setRenderer(150,150);
	
	//temp camera while model loads
	camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000);
	//camera.position.set(0,0,500);
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	
	addGrid();
	addLabels();
	getscreendims();
	
	animate();
}

function animate() 
{
	requestAnimationFrame( animate );
	render();
}

function render() 
{

  renderer.render( scene, camera );
}


function addGrid(){
// grid
        
        var geometry = new THREE.Geometry();
        
        //x axis
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0.5, 0, 0 ) );
        //y axis
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 1.2,0 ) );

        //z axis
        geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
        geometry.vertices.push( new THREE.Vector3( 0, 0,1.2 ) );

        var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0, transparent: false } );
        var line = new THREE.LineSegments( geometry, material );
        
        
        scene.add( line );
        //setCameraToLookAtMyObj(line.geometry.vertices,fov,0.2,"persp");
        setCameraForCluster(line.geometry.vertices);
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
            //(text,font,size,height,x,y,z,rX,rY,rZ)
              label = createText("temperature",font,0.08,0,0.2,0,0,0,0,0);
              scene.add(label);
          
          
              label = createText("relative humidty",font,0.08,0,0,0.2,0,0,0,Math.PI/2);
              scene.add(label);

              label = createText("wind speed",font,0.08,0,0,0,0.2,0,-Math.PI/2,0);
              scene.add(label);
          
        });

}

function buildMesh(data)
{
	
var geom = new THREE.Geometry();
meshData = d3.csvParseRows(data);
var meshN=0;
var material;
var vCount=3;
var mesh;
//result the name array
meshNames=[];
  for(var i=0;i<meshData.length;i++){

	
	if(meshData[i].length===1){
		meshN=meshData[i][0];
		material = new THREE.MeshBasicMaterial({ color: getColorSpectral(meshN) });
		material.side  = THREE.BackSide;
		//moveVerticesToModelOrigin(geom.vertices);
		if(geom.vertices.length!=0){
  		mesh = new THREE.Mesh( geom, material );
		mesh.name = "cluster"+meshN;
		meshNames.push(mesh.name);
		// var edges = showMeshEdges(mesh,0x000000);
  // 		scene.add(edges);
  		scene.add(mesh);
  		geom = new THREE.Geometry();
		vCount=3;
  		}
  		
	}
  	
  	else{
  		geom.vertices.push(new THREE.Vector3(meshData[i][0],meshData[i][1],meshData[i][2]));
   		geom.faces.push( new THREE.Face3(vCount-3,vCount-2,vCount-1) );
   		vCount+=3;
  	}

  }
  //setCameraForCluster();
  //
  
	

}


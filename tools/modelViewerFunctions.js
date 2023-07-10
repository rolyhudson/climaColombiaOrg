var rWidth;
var rHeight;
function getscreendims()
{
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var description = document.getElementById("title");
    //hide dat gui controls too 
    //var controls = document.getElementsByClassName("dg main a");
    if(x>800)
    {
	description.style.display = "block";
	//controls[0].style.display = "block";
	return true;
    }
    else
    {
	description.style.display = "none";
	//controls[0].style.display = "none";
	return false;
    }
}
function onWindowResize() {
var w = document.getElementById( 'container3d' ).clientWidth;
var h = document.getElementById( 'container3d' ).clientHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();

	renderer.setSize( w, h );

}
function setRenderer(w,h)
{
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setClearColor( 0xc1d7d7);
	rWidth=w;
	rHeight=h;
	renderer.setSize(w,h);
	container = document.getElementById( 'container3d' );	
	container.appendChild( renderer.domElement );
	//window.addEventListener( 'resize', onWindowResize, false );
}
function insertLines(vectors,col)
{
	
	calcBSphereFromVector3Array(vectors);
	//load data
	var material = new THREE.LineBasicMaterial({ color:col});
	var lineGeo = new THREE.Geometry();
	for( var i = 0; i < vectors.length; i ++ )
		{
			lineGeo.vertices.push(vectors[i]);
		}
	lineGeo.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI/2 ) );
	var line = new THREE.LineSegments(lineGeo,material);	
	return line;
}
function showMeshEdges(object,color)
{

	var edges = new THREE.EdgesHelper( object, color );//black line on edges
    return edges;
}
function makeAGroundPlane()
{
var geometry = new THREE.PlaneGeometry( camDist,camDist,100,100);
var material =    new THREE.MeshLambertMaterial({color: 0xa6a6a6});
var plane = new THREE.Mesh( geometry, material );
plane.position.set(sceneBSCenter.x,sceneBSCenter.y,minVect.z);
plane.receiveShadow  = true;
return plane;
}

function visualiseCamToAllDists(vectors)
{
	geometry = new THREE.Geometry();
	for( var i = 0; i < vectors.length; i ++ )
		{
		geometry.vertices.push(
			camera.position,
			vectors[i]
		);
		material = new THREE.LineDashedMaterial({ color: 0x0000FF });
		
		
	}
	testlines = new THREE.LineSegments( geometry, material );
	scene.add(testlines);
}
function convertCoordsToVectors(coords)
{
	var allpoints =[];
for( var i = 0; i < coords.length; i +=3 )
	{
	allpoints.push(new THREE.Vector3(coords[i],coords[i+1],coords[i+2]));
	}
	return allpoints;
}
function calcBSphereFromVector3Array(coords)
{
	//set max min bbox vectors 
	minVect = coords[0];
	maxVect = coords[0];
	//get bbox corners
	for( var i = 0; i < coords.length; i ++ )
	{
	maxmin(coords[i]);
	}
	//compute sphere centre
	sceneBSCenter.addVectors(minVect, maxVect);
	sceneBSCenter.divideScalar(2.0);
	//find furthest point from center
	var firstpoint = coords[0];
	sceneBSRadius=sceneBSCenter.distanceTo(firstpoint);
	for( var i = 0; i < coords.length; i ++)
		{
		firstpoint = coords[i];
		sceneBSRadius = maxDist(sceneBSCenter,sceneBSRadius,firstpoint.x,firstpoint.y,firstpoint.z );
		}
		//drawsphere(sceneBSRadius,sceneBSCenter,0x003300);
}
function shiftpoints(vectors)
{
	shiftToCentre = new THREE.Vector3(-sceneBSCenter.x,-sceneBSCenter.y,-sceneBSCenter.z);
	
	for( var i = 0; i < vectors.length; i ++ )
		{
			vectors[i].x +=shiftToCentre.x;
			vectors[i].y +=shiftToCentre.y;
			vectors[i].z +=shiftToCentre.z;
		}
}

function moveVerticesToModelOrigin(objvertices)
{
	calcBSphereFromVector3Array(objvertices);
	shiftpoints(objvertices);
}
function setCameraToLookAtMyObj(objvertices,fov,zoomInAdjust,viewtype)
{
calcBSphereFromVector3Array(objvertices);

camDist = sceneBSRadius/Math.atan(fov/2*Math.PI/180);//to fit bounding sphere in view
camDist = camDist*zoomInAdjust;
camera = new THREE.PerspectiveCamera( fov, rWidth / rHeight, 0.1,camDist*30);
if(viewtype == "horiz")
{
camera.position.set(sceneBSCenter.x+camDist,sceneBSCenter.y,sceneBSCenter.z+camDist);
}
else
{
camera.position.set(-3.0,sceneBSCenter.y+1.2*camDist,sceneBSCenter.z+camDist);
}

controls = new THREE.OrbitControls( camera, renderer.domElement );

controls.target = new THREE.Vector3(sceneBSCenter.x,sceneBSCenter.y,sceneBSCenter.z);
controls.update();
}

function setCameraForCluster(objvertices){

	calcBSphereFromVector3Array(objvertices);
	camera = new THREE.PerspectiveCamera(30, rWidth / rHeight, 0.1,10);
	camera.position.set(-2,2,2);
	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//controls.target = new THREE.Vector3(sceneBSCenter.x,sceneBSCenter.y,sceneBSCenter.z);
	controls.update();
}
function maxmin(testPoint)
{
	
	var minX=minVect.x;var maxX =maxVect.x;
	var minY=minVect.y;var maxY =maxVect.y;
	var minZ=minVect.z;var maxZ =maxVect.z;

	if(testPoint.x<minVect.x){minX=testPoint.x;}

	if(testPoint.x>maxVect.x){maxX=testPoint.x;}

	if(testPoint.y<minVect.y){minY=testPoint.y;}

	if(testPoint.y>maxVect.y){maxY=testPoint.y;}

	if(testPoint.z<minVect.z){minZ=testPoint.z;}

	if(testPoint.z>maxVect.z){maxZ=testPoint.z;}

	minVect = new THREE.Vector3(minX,minY,minZ);
	maxVect = new THREE.Vector3(maxX,maxY,maxZ);
}
function maxDist(sceneBSCenter,sceneBSRadius, x,y,z)
{
	var dist = sceneBSCenter.distanceTo(new THREE.Vector3(x,y,z));
	if (dist>sceneBSRadius){sceneBSRadius=dist;}
	return sceneBSRadius;
}

function drawsphere(radius,center,col)
{
	var geometry = new THREE.SphereGeometry(radius, 15, 15 );
	var material = new THREE.MeshBasicMaterial( { wireframe: true,color:col } );
	var sphere = new THREE.Mesh( geometry, material );
	sphere.position.set(center.x,center.y,center.z);
	scene.add( sphere );
}
function addBasicLighting()
{
 light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 10, 10, 10 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );
	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );
 
}
function lightingForPhong(){
	var light = new THREE.PointLight( 0xFFFF00 );
	light.position.set( 10, 0, 10 );
	scene.add( light );
}
function makeMesh(vertices,faces,colors)
	{
		var color = new THREE.Color();
		var color3=[];
		var geom = new THREE.Geometry();
		var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors,side:THREE.DoubleSide}); 
		var colorMaterial =  new THREE.MeshLambertMaterial( {color: 0xa6a6a6, side: THREE.DoubleSide} );
		var depthmat = new THREE.MeshDepthMaterial();
		var gotCols=false;
		for(var i =3;i<colors.length;i+=4)
		{
			color = new THREE.Color("rgb("+colors[i-2]+","+ colors[i-1]+","+ colors[i]+")");
			color3.push(color);

		}
			
		
		for(var i=0;i<vertices.length;i++)
		{
			geom.vertices.push(vertices[i]);

		}
		var faceCount=-1;
		if(colors.length==0)
		{
			color = new THREE.Color("rgb(100,100,100)");
			for(var i =3;i<faces.length;i+=4)
			{
				geom.faces.push( new THREE.Face3( faces[i-3],faces[i-2],faces[i-1]) );
				faceCount++;
				geom.faces[faceCount].vertexColors[0]=color;
				geom.faces[faceCount].vertexColors[1]=color;
				geom.faces[faceCount].vertexColors[2]=color;
				geom.faces.push( new THREE.Face3( faces[i-3],faces[i-1],faces[i]) );
				faceCount++;
				geom.faces[faceCount].vertexColors[0]=color;
				geom.faces[faceCount].vertexColors[1]=color;
				geom.faces[faceCount].vertexColors[2]=color;


			}
		}
		else
		{
			gotCols=true;
			for(var i =3;i<faces.length;i+=4)
			{
				geom.faces.push( new THREE.Face3( faces[i-3],faces[i-2],faces[i-1]) );
				faceCount++;
				geom.faces[faceCount].vertexColors[0]=color3[faces[i-3]];
				geom.faces[faceCount].vertexColors[1]=color3[faces[i-2]];
				geom.faces[faceCount].vertexColors[2]=color3[faces[i-1]];
				geom.faces.push( new THREE.Face3( faces[i-3],faces[i-1],faces[i]) );
				faceCount++;
				geom.faces[faceCount].vertexColors[0]=color3[faces[i-3]];
				geom.faces[faceCount].vertexColors[1]=color3[faces[i-1]];
				geom.faces[faceCount].vertexColors[2]=color3[faces[i]];


			}
		}
		
		geom.computeFaceNormals();
		geom.computeVertexNormals();
		geom.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI/2 ) );
		
		var mesh = new THREE.Mesh( geom, material);

		mesh.castShadow = true;
		mesh.receiveShadow=true;
		return mesh;

	}
	function fullscreen()
{
window.open("#");
}	
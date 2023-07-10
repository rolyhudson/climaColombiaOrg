
        
var textMaterial = new THREE.MultiMaterial( [
          new THREE.MeshPhongMaterial( { color: 0x666666, shading: THREE.FlatShading } ), // front
          new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
        ] );

function loadFont(file) {
        var loader = new THREE.FontLoader();
        
        var font = loader.load(
          // resource URL
          file,
          // Function when resource is loaded
          function ( f ) {
            // do something with the font
            console.log( 'font loaded' );
            font =f;
          }
          // },
          // // Function called when download progresses
          // function ( xhr ) {
          //   console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
          // },
          // // Function called when download errors
          // function ( xhr ) {
          //   console.log( 'An error happened' );
          // }
        );
}

function createText(text,font,size,height,x,y,z,rX,rY,rZ) {

       var textGeo = new THREE.TextGeometry( text, {
          font: font,
          size: size,
          height: height,
          curveSegments: 4,
          bevelEnabled: false,
          material: 0,
          extrudeMaterial: 1
        });
        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();
        // "fix" side normals by removing z-component of normals for side faces
        // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
        
        //var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        var textMesh1 = new THREE.Mesh( textGeo, textMaterial );
        textMesh1.position.x = x;
        textMesh1.position.y = y;
        textMesh1.position.z = z;
        textMesh1.rotation.x = rX;
        textMesh1.rotation.y = rY;
        textMesh1.rotation.z = rZ;
        return textMesh1;
        
      }
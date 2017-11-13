// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
//var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//camera.position.z = 4;
var width  = window.innerWidth,
height = window.innerHeight;


var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
camera.rotation.set(0.3432142160961214, -0.6802072624449855, 0)
camera.position.set(-18.48166841328442, -7.687684632094362, 21.51259108437748)




// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

// Add cube to Scene
//scene.add( cube );



var moon_orbit = new THREE.Object3D();



var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath( './' );
var earth;
mtlLoader.load( 'CHAHIN_EARTH.mtl', function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials( materials );
    objLoader.setPath( './' );
    objLoader.load( 'CHAHIN_EARTH.obj', function ( object ) {
        scene.add( object );
        earth = object;
        earth.children[0].material.shininess = 10
        earth.add(moon_orbit);
        
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5,3,5);
        scene.add(light);
        
        light.target = earth;
        scene.add( light.target );
        
    }, function(){}, function(){} );

});

var program = function ( context ) {
    context.beginPath();
    context.arc( 0, 0, 0.5, 0, Math.PI*2, true );
    context.fill();
};

var satellite;
mtlLoader.load( 'Satellite.mtl', function( materials ) {

        materials.preload();
    
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( './' );
        objLoader.load( 'Satellite(1).obj', function ( object ) {
            object.scale.set(1/8,1/8,1/8);
            scene.add( object );
            satellite = object;
            moon_orbit.add(satellite);
            satellite.position.set(0, 10, 0);
            light1 = new THREE.PointLight( 0xff0040, 1, 50 );
            satellite.add(light1);
            light1.position.set(0,5.3,14.3)
            
            sprite = new THREE.Sprite( new THREE.SpriteMaterial( { color: 0xff0040, program: program } ) );
            light1.add( sprite );
            
    
        }, function(){}, function(){} );
    
    });

//scene.add(new THREE.AmbientLight(0x333333,0.2));


/*
 //Space background is a large sphere
 //var spacetex = THREE.ImageUtils.loadTexture("https://s3-us-west-2.amazonaws.com/s.cdpn.io/96252/space.jpg");
 var spacetex = THREE.ImageUtils.loadTexture("./Starscape.png");
 var spacesphereGeo = new THREE.SphereGeometry(80,20,20);
 var spacesphereMat = new THREE.MeshPhongMaterial();
 spacesphereMat.map = spacetex;

 var spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);
 
 //spacesphere needs to be double sided as the camera is within the spacesphere
 spacesphere.material.side = THREE.DoubleSide;
 
 spacesphere.material.map.wrapS = THREE.RepeatWrapping; 
 spacesphere.material.map.wrapT = THREE.RepeatWrapping;
 spacesphere.material.map.repeat.set( 5, 3);
 
 scene.add(spacesphere);
 */

controls = new THREE.OrbitControls( camera, renderer.domElement );



// Render Loop
var time = 0
var speed = 1
var render = function () {
  requestAnimationFrame( render );

  time = time + speed;
  var e_angle = time * 0.001;
  //earth.position.set(350* Math.cos(e_angle), 350* Math.sin(e_angle), 0);

  var m_angle = time * 0.01;
  moon_orbit.rotation.set(0, 0, m_angle);

  earth.rotation.set(0,time*0.001,0.4101524);
  if (time%120==60){
    light1.intensity = 0;
    sprite.material.color.set(0,0,0);
  }
  else if(time%60==0){
    light1.intensity = 0.1;
    sprite.material.color.set(0xff0040);
  }

  // Render the scene
  renderer.render(scene, camera);
};

render();
// *svar scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setClearColor( 0xFFFFFF );
// document.body.appendChild( renderer.domElement );

// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// directionalLight.position.set( 0, 1, 0 );
// scene.add( directionalLight );
// var ambientlight = new THREE.AmbientLight( 0x404040 );
// scene.add( ambientlight);
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshPhongMaterial({ color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading }  );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// var geometry = new THREE.BoxGeometry(10,10,0.2);


// camera.position.z =2;

'use strict';

Physijs.scripts.worker = '../physijs_worker.js'
Physijs.scripts.ammo = '../app/assets/javascripts/ammo.js';


var initScene, render, renderer, scene, camera, box;

initScene = function() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	1,
	1000
    );

    camera.position.set(60,50,60);
    camera.lookAt(scene.position);
    scene.add(camera);

    box = new Physijs.BoxMesh(
	new THREE.CubeGeometry( 5, 5, 5 ),
	new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    scene.add( box );

    requestAnimationFrame( render );
};

render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};

window.onload = initScene;
var initScene, render, renderer, scene, camera, box;

initScene = function() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	1,
	1000
    );
    camera.position.set( 60, 50, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );

    // Box
    box = new Physijs.BoxMesh(
	new THREE.CubeGeometry( 5, 5, 5 ),
	new THREE.MeshBasicMaterial({ color: 0x888888 })
    );
    scene.add( box );

    requestAnimationFrame( render );
};

render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};

window.onload = initScene;

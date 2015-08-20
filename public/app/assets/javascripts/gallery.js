
// What was this doing?
// 'use strict';

Physijs.scripts.worker = '/app/assets/javascripts/physijs_worker.js';
Physijs.scripts.ammo = '/app/assets/javascripts/ammo.js';

// Do all of these variables need to be global?
var initScene, render, renderer, scene, 
    camera, box, dir_light, am_light, table, intersect_plane, sphere, table_material, 
    initEventHandling, moveable_objects = [], thing_offset = new THREE.Vector3, 
    selected_thing = null, mouse_position = new THREE.Vector3, _v3 = new THREE.Vector3;

initScene = function() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    // Does this return the right container? Let's make sure we can add some html stuff if we want
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;
    renderer.setClearColor( 0xFFFFFF );
    document.body.appendChild(renderer.domElement);

    // Initialize Physijs Scene
    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3(0, -10, 0) );
    
    // Click-and-drag functionality
    scene.addEventListener( 'update', function() {
	    if ( selected_thing !== null ) {

		_v3.copy( mouse_position ).sub( selected_thing.position ).multiplyScalar( 5 );
		_v3.y = 0;
		selected_thing.setLinearVelocity( _v3 );

		// Reactivate all of the moveable objects
		_v3.set( 0, 0, 0 );
		for ( _i = 0; _i < moveable_objects.length; _i++ ) {
		    moveable_objects[_i].applyCentralImpulse( _v3 );
		}
	    }
	    scene.simulate( undefined, 1 );
	}
    );
    
    // We should change this to ortho camera
    camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	.001,
	1000
    );

    camera.position.set(70,50,70);
    camera.lookAt(scene.position);
    // scene.add(camera);

    // ambient light
    am_light = new THREE.AmbientLight( 0x444444 );
    scene.add( am_light );
    // directional light
    dir_light = new THREE.DirectionalLight( 0xFFFFFF );
    dir_light.position.set( 20, 30, -5 );
    dir_light.target.position.copy( scene.position );
    dir_light.castShadow = true;
    dir_light.shadowCameraLeft = -75;
    dir_light.shadowCameraTop = -75;
    dir_light.shadowCameraRight = 75;
    dir_light.shadowCameraBottom = 75;
    dir_light.shadowCameraNear = 0;
    dir_light.shadowCameraFar = 75;
    dir_light.shadowBias = -.001
    dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
    dir_light.shadowDarkness = .5;

    scene.add( dir_light );


    table = new Physijs.BoxMesh(
	   new THREE.BoxGeometry(150,1,150),
	   new THREE.MeshLambertMaterial({ color: 0xd7c6cf }),
	   0, // mass
	   { restitution: .2, friction: .8 }
    );
    
    table.receiveShadow = true;
    table.position.y = -15;
    table.position.z = 6;
    table.position.x = 20;
    
    scene.add( table );

    box = new Physijs.BoxMesh(
	   new THREE.BoxGeometry( 10, 10, 10 ),
	   new THREE.MeshLambertMaterial({ color: 0xFF66FF }),
	    .9,
	   .4
	);

    box.position.y = 20;
    box.castShadow = true;
    box.receiveShadow = true;

    scene.add( box );
    //add box to the array of shit that can be moved
    moveable_objects.push( box ); 

    sphere = new Physijs.SphereMesh(
	   new THREE.SphereGeometry(5),
	   new THREE.MeshLambertMaterial({ color: 0x663300 }),
	   .9,
	   { restitution: .9, friction: .8 }
    );

    sphere.position.y=30;
    sphere.castShadow = true;
    sphere.receiveShadow= true;
    
    scene.add( sphere );
    moveable_objects.push( sphere );

    /* Load the dragon statue */
    var manager = new THREE.LoadingManager();
    var loader = new THREE.PLYLoader(manager);

    loader.load( './app/assets/ply/ascii/dragon_vrip_res3.ply', function ( geometry ){
            var material = new THREE.MeshPhongMaterial( {
                ambient  : 0xffffff,
                color    : 0xffffff,
                specular : 0xffffff,
                shininess: 100
            } );

            // Adjust geometry to match something ;?
            geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -.125, 0 ) );

            var mesh = new Physijs.BoxMesh( geometry, Physijs.createMaterial( material, 10.0, 0.0), 10.0 );
            mesh.position.set( -0.25, -0.70, -0.5 );
            mesh.scale.set   ( 50.0, 50.0, 50.0 );
            mesh.castShadow     = true;
            mesh.receiveShadow  = true;
            scene.add( mesh );
            moveable_objects.push( mesh );
    } );


    intersect_plane = new THREE.Mesh(
	   new THREE.PlaneGeometry( 150, 150 ),
	   new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
    );

    intersect_plane.rotation.x = Math.PI / -2;
    intersect_plane.position
    
    scene.add( intersect_plane );

    initEventHandling(); //handle mouse clicks
    requestAnimationFrame( render ); //render scene
};

render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};



//handles resizing of the window
//pleae do not edit 
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}



//MOUSE-CLICKING FUNCTION
//DO NOT EDIT
//please
initEventHandling = (function() {
    var _vector = new THREE.Vector3();
    var raycaster = new THREE.Raycaster();
    var handleMouseDown, handleMouseMove, handleMouseUp;
    
    handleMouseDown = function( evt ) {
	var intersections
	
	_vector.set((evt.clientX / window.innerWidth) * 2 - 1,
		    -(evt.clientY / window.innerHeight ) * 2 + 1,
		   1);
	
	raycaster.setFromCamera(_vector, camera);
	intersections = raycaster.intersectObjects( moveable_objects ); 

	if (intersections.length > 0) {
	    selected_thing = intersections[0].object;

	    _vector.set(0,0,0);
	    selected_thing.setAngularFactor( _vector);
	    selected_thing.setAngularVelocity( _vector);
	    selected_thing.setLinearFactor( _vector);
	    selected_thing.setLinearVelocity( _vector);

	    mouse_position.copy(intersections[0].point);
	    thing_offset.subVectors( selected_thing.position, mouse_position);

	    intersect_plane.position.y = mouse_position.y;
	}

    };

    handleMouseMove = function( evt ) {
	var intersection

	if (selected_thing !== null) { 

	    _vector.set(
		( evt.clientX / window.innerWidth ) * 2 - 1,
		    -( evt.clientY / window.innerHeight ) * 2 + 1,
		1);
	    
	    raycaster.setFromCamera(_vector, camera);
	    intersection = raycaster.intersectObject( intersect_plane );
	    mouse_position.copy(intersection[0].point);
	}
    };

    handleMouseUp = function( evt ) {

	if (selected_thing !== null) {
	    _vector.set(1,1,1);
	    selected_thing.setAngularFactor( _vector );
	    selected_thing.setLinearFactor( _vector );
	    selected_thing = null;
	}
    };

    return function() {
	renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
	renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
	renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
    };
})();



window.onload = initScene;

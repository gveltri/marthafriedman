'use strict';

Physijs.scripts.worker = '/app/assets/javascripts/physijs_worker.js';
Physijs.scripts.ammo = '/app/assets/javascripts/ammo.js';


var initScene, render, renderer, scene, camera, box, dir_light, am_light, table, table_material, intersect_plane, selected_box, initEventHandling, mouse_position;

initScene = function() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;
    renderer.setClearColor( 0xFFFFFF );
    document.body.appendChild(renderer.domElement);

    scene = new Physijs.Scene;

    camera = new THREE.PerspectiveCamera(
	35,
	window.innerWidth / window.innerHeight,
	1,
	1000
    );

    camera.position.set(70,50,70);
    camera.lookAt(scene.position);
    scene.add(camera);

    // ambient light
    am_light = new THREE.AmbientLight( 0x444444 );
    scene.add( am_light );
    // directional light
    dir_light = new THREE.DirectionalLight( 0xFFFFFF );
    dir_light.position.set( 20, 30, -5 );
    dir_light.target.position.copy( scene.position );
    dir_light.castShadow = true;
    dir_light.shadowCameraLeft = -30;
    dir_light.shadowCameraTop = -30;
    dir_light.shadowCameraRight = 30;
    dir_light.shadowCameraBottom = 30;
    dir_light.shadowCameraNear = 20;
    dir_light.shadowCameraFar = 200;
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
    table.position.y = -.5;
    table.position.z = 6;
    table.position.x = 20;
    scene.add( table );

    
    box = new Physijs.BoxMesh(
	new THREE.BoxGeometry( 10, 10, 10 ),
	new THREE.MeshLambertMaterial({ color: 0xFF66FF }),
	    .4,
	.4
	
    );
    box.position.y=20;
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add( box );


    intersect_plane = new THREE.Mesh(
	new THREE.PlaneGeometry( 150, 150 ),
	new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
    );
    intersect_plane.rotation.x = Math.PI / -2;
    scene.add( intersect_plane );

    initEventHandling(); //handle mouse clicks
    requestAnimationFrame( render ); //render scene

};

render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//this shit is broken pls fix

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
	intersections = raycaster.intersectObject( box );

	if (intersections.length > 0) {
	    selected_box = intersections[0].object;

	    _vector.set(0,0,0);
	    selected_box.setAngularFactor( _vector);
	    selected_box.setAngularVelocity( _vector);
	    selected_box.setLinearFactor( _vector);
	    selected_box.setLinearVelocity( _vector);

	    mouse_position.copy( intersections[0].point );
	    box_offset.subVectors( selected_box.position, mouse_position);

	    intersect_plane.position.y = mouse_position.y;
	}

    };

    handleMouseMove = function( evt ) {
	var intersection

	if (selected_box !== null) {

	    _vector.set(
		( evt.clientX / window.innerWidth ) * 2 - 1,
		    -( evt.clientY / window.innerHeight ) * 2 + 1,
		1);
	    raycaster.setFromCamera(_vector, camera);
	    intersection = raycaster.intersectObject(intersect_plane);
	    mouse_position.copy( intersection[0].point);
	}
    };

    handleMouseUp = function( evt ) {

	if (selected_box !== null) {
	    _vector.set(1,1,1);
	    selected_box.setAngularFactor( _vector );
	    selected_box.setLinearFactor( _vector );
	    selected_box = null;
	}
    };

    return function() {
	renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
	renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
	renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
    };
})();



window.onload = initScene;

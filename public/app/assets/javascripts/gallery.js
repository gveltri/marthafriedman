
Physijs.scripts.worker = '/app/assets/javascripts/physijs_worker.js';
Physijs.scripts.ammo = '/app/assets/javascripts/ammo.js';


var initScene, render, renderer, scene, 
    camera, box, dir_light, am_light, table, intersect_plane, sphere, table_material, 
    initEventHandling, moveable_objects = [], thing_offset = new THREE.Vector3, 
    selected_thing = null, mouse_position = new THREE.Vector3, _v3 = new THREE.Vector3, olives = [], cylinder, snap = false;

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
    scene.setGravity( new THREE.Vector3(0, -20, 0) );
    
    // Click-and-drag functionality
    scene.addEventListener( 'update', function() {
	if ( selected_thing !== null && !(snap) ) {

 		
		
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

    var table_texture = new THREE.ImageUtils.loadTexture( 'app/assets/textures/parquet.jpg');
    table_texture.wrapS = table_texture.wrapT = THREE.RepeatWrapping;
    table_texture.repeat.set(10,10);

    table = new Physijs.BoxMesh(
	   new THREE.BoxGeometry(150,1,150),
	new THREE.MeshLambertMaterial({ map: table_texture, ambient: 0xFFFFFF }),
	   0, // mass
	   { restitution: 10, friction: 10 }
    );
    
    table.receiveShadow = true;
    table.position.y = -15;
    table.position.z = 6;
    table.position.x = 20;
    table.rotation.y = -Math.PI / 6;
    
    scene.add( table );

    box = new Physijs.BoxMesh(
	   new THREE.BoxGeometry( 10, 10, 10 ),
	   new THREE.MeshLambertMaterial({ color: 0xFF66FF }),
	    10,
	   10
	);

    box.position.set(-10, -9.5, 10);
    box.castShadow = true;
    box.receiveShadow = true;

    scene.add( box );
    //add box to the array of shit that can be moved
    moveable_objects.push( box ); 

    var sphere_material = Physijs.createMaterial(
	new THREE.MeshBasicMaterial({ color: 0x663300 }),
	0.9,
	0.9
    );
    
    
    sphere = new Physijs.SphereMesh(
	new THREE.SphereGeometry(5,20),
	   sphere_material,
	  9
    );

    sphere.position.set(-10, 0.3, 10);
    sphere.castShadow = true;
    sphere.receiveShadow= true;
    
    scene.add( sphere );
    moveable_objects.push( sphere );


    armature = new Physijs.ConvexMesh(
	   new THREE.BoxGeometry( 4, 4, 4 ),
	   new THREE.MeshLambertMaterial({ color: 0xEEEEEE }),
	    9,
	   .4
    );

    intersect_cylinder = new THREE.Mesh(
	new THREE.CylinderGeometry(0.5,0.5,30.8),
	new THREE.MeshLambertMaterial());
    intersect_cylinder.position.set(10,2,-10);
    scene.add(intersect_cylinder);

    intersect_cylinder.castShadow = true;
    intersect_cylinder.receiveShadow = true;

    armature.position.set(10,-12.5, -10);
    armature.castShadow = true;
    armature.receiveShadow= true;
    
    scene.add( armature );

    var _v3 = new THREE.Vector3(0,0,0);
    armature.setAngularFactor(_v3);
    armature.setLinearFactor(_v3);


    //olive constructor
    function Olive() {
	var olive1 = new Physijs.CylinderMesh(
	    new THREE.CylinderGeometry(2.5,2.5,5,20),
	    new THREE.MeshLambertMaterial({ color: 0x66CC00}),
	    5,
	    20
	);
	olive1.castShadow = true;
	olive1.receiveShadow = true;
	return olive1;
    }

    function OliveCreator(num) {
	for (var i = 0; i < num; i++) {
	    var y = -8 + (i * 5);
	    var olive = Olive();
	    olive.position.set(10,y,-10);
	    olive.rotation.x=Math.PI / 2;
	    olive.rotation.z=Math.PI / 2;
	    
	    scene.add( olive );

	    var _v3 = new THREE.Vector3(0,0,0);
	    olive.setAngularFactor(_v3);
	    olive.setLinearFactor(_v3);

	    olives.push( olive );
	}	    
    }

    //creates olives and adds them to the scene
    //makes last olive moveable
    OliveCreator(6);
    moveable_objects.push(olives[olives.length-1]);

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
//jk edit me a lil ;-P
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
	    
	    // if it is on the olive totem, pop it and make it dynamic
	    if (selected_thing == olives[olives.length-1]) {
		olives.pop();
		if (olives.length !== 0)
		moveable_objects.push(olives[olives.length-1]);
	    }
	    // end olive totem
	    
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
	    if ( intersection[0] != undefined) {
		mouse_position.copy(intersection[0].point);
	    }
	}
    };

    handleMouseUp = function( evt ) {


	if (selected_thing !== null) {

	   
		
	    _vector.set(1,1,1);
	    selected_thing.setAngularFactor( _vector );
	    selected_thing.setLinearFactor( _vector );


	    // snapping to armature

	    	_vector.set((evt.clientX / window.innerWidth) * 2 - 1,
		    -(evt.clientY / window.innerHeight ) * 2 + 1,
		   1);


	    raycaster.setFromCamera(_vector, camera);
	    var collisionResults = raycaster.intersectObjects( [intersect_cylinder, armature].concat(olives) );
	    
	    if ( collisionResults.length !== 0) {
		if (olives.length == 0) {
		    var snap_y = -11 + selected_thing.geometry.boundingSphere.radius;		
		}
		else {
	    	    var snap_y = olives[olives.length-1].position.y + olives[olives.length-1].geometry.boundingSphere.radius + selected_thing.geometry.boundingSphere.radius - 2;
		}

		selected_thing.__dirtyPosition = true;

		//put object in position
		selected_thing.position.x=armature.position.x;
		selected_thing.position.y=snap_y;
		selected_thing.position.z=armature.position.z;


		//make object static
		var _v3 = new THREE.Vector3(0,0,0);
		selected_thing.setAngularFactor(_v3);
		selected_thing.setLinearFactor(_v3);
		selected_thing.setLinearVelocity(_v3);

		//make last object on olive totem moveable
		var last_index = moveable_objects.indexOf(olives[olives.length-1]);
		moveable_objects.splice(last_index,last_index);
		if (moveable_objects.indexOf(selected_thing) == null) {
		    moveable_objects.push(selected_thing); // avoids creating duplicates if the object is already in the moveable objects array
		}
		olives.push(selected_thing);
		    

	    }
	    
	    //end snapping
	    
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

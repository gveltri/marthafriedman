
Physijs.scripts.worker = '/app/assets/javascripts/physijs_worker.js';
Physijs.scripts.ammo = '/app/assets/javascripts/ammo.js';


var initScene, render, renderer, scene, 
    camera, dir_light, am_light, intersect_plane, table_material, 
    initEventHandling, moveable_objects = [], selected_thing = null,
    mouse_position = new THREE.Vector3, _v3 = new THREE.Vector3, sculptures=[],
    static_surfaces=[];

initScene = function() {
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.shadowMapAutoUpdate = true;
    renderer.setClearColor( 0xece7eb );
    document.body.appendChild(renderer.domElement);
    //allows keydown to be heard 
    renderer.domElement.setAttribute("tabindex", 0);
    
    // Initialize Physijs Scene
    scene = new Physijs.Scene();
    scene.setGravity( new THREE.Vector3(0, -20, 0) );
    
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
    

    camera = new THREE.PerspectiveCamera(
    	35,
    	window.innerWidth / window.innerHeight,
    	.001,
    	1000
    );

    

    camera.position.set(120,40,60);
    camera.lookAt(scene.position);

    // ambient light
    am_light = new THREE.AmbientLight( 0x444444 );
    scene.add( am_light );

    var light = new THREE.PointLight( 0xFFFFFF, 0.5, 100 );
    light.position.set( -15, 20, -30 );
    scene.add( light );



    // directional light
    dir_light = new THREE.DirectionalLight( 0xFFFFFF );
    dir_light.position.set( 20, 30, -5 );
    dir_light.target.position.copy( scene.position );
    dir_light.castShadow = true;
    dir_light.shadowCameraLeft = -100;
    dir_light.shadowCameraTop = -100;
    dir_light.shadowCameraRight = 100;
    dir_light.shadowCameraBottom = 100;
    dir_light.shadowCameraNear = 0;
    dir_light.shadowCameraFar = 100;
    dir_light.shadowBias = -.001
    dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
    dir_light.shadowDarkness = .3;

    scene.add( dir_light );

    dir_light2 = new THREE.DirectionalLight( 0xFCD440);
    dir_light2.position.set( 5, 30, 20 );
    dir_light2.target.position.copy( scene.position );
    dir_light2.castShadow = true;
    dir_light2.shadowCameraLeft = -100;
    dir_light2.shadowCameraTop = -100;
    dir_light2.shadowCameraRight = 100;
    dir_light2.shadowCameraBottom = 100;
    dir_light2.shadowCameraNear = 0;
    dir_light2.shadowCameraFar = 100;
    dir_light2.shadowBias = -.001
    dir_light2.shadowMapWidth = dir_light2.shadowMapHeight = 2048;
    dir_light2.shadowDarkness = .1;
    dir_light2.intensity = 0.3;

    scene.add( dir_light2 );


    //space init
    Wall(-110,5,-25,40,110,'app/assets/textures/stucco.jpg',0);
    Wall(-50,5,-80,40,120,'app/assets/textures/stucco.jpg',Math.PI/2);
    Table(-50,-15,-55,120,50,'app/assets/textures/concrete.jpg',0);
    Table(-70,-15,0,80,60,'app/assets/textures/concrete.jpg',0);
    Table(0,-15.5,10,60,80,'app/assets/textures/grass.jpg',0);



    //sculptures init
    Armature(-20,-55);
    Hairball(-65, 10);
    Egg(-70,-40);
    


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

function Table(x,y,z,x_size,y_size,texture_path,rotation) {

    rotation = typeof rotation !== 'undefined' ? rotation : (-Math.PI / 4);
    
    var table_texture = new THREE.ImageUtils.loadTexture( texture_path );
    table_texture.wrapS = table_texture.wrapT = THREE.RepeatWrapping;
    table_texture.repeat.set(3,3);

    var table_material = new Physijs.createMaterial(
	new THREE.MeshPhongMaterial({ map: table_texture, ambient: 0xFFFFFF }),
	0.8,
	0.9);
    
    var table = new Physijs.BoxMesh(
	new THREE.BoxGeometry(x_size,1,y_size),
	table_material,
	   0
    );
    
    table.receiveShadow = true;
    table.position.set(x,y,z);
    table.rotation.y = rotation;
    
    scene.add( table );
    static_surfaces.push(table);
};


function Wall(x,y,z,x_size,y_size,texture_path,rotation,visible) {

    rotation = typeof rotation !== 'undefined' ? rotation : (-Math.PI / 4);
    visible = typeof visible !== 'undefined' ? visible : true;
    
    var wall_texture = new THREE.ImageUtils.loadTexture( texture_path );
    wall_texture.wrapS = wall_texture.wrapT = THREE.RepeatWrapping;
    wall_texture.repeat.set(3,3);


    
    var wall_material = new Physijs.createMaterial(
	new THREE.MeshPhongMaterial({ map: wall_texture, ambient: 0xFFFFFF }),
	0.8,
	0.9);

    if (!visible) wall_material = new Physijs.createMaterial(
	new THREE.MeshPhongMaterial({opacity: 0, transparent: true  }),
	0.8,
	0.9
    );
    
    var wall = new Physijs.BoxMesh(
	new THREE.BoxGeometry(x_size,1,y_size),
	wall_material,
	   0
    );


    
    wall.receiveShadow = true;
    wall.castShadow = true;
    wall.position.set(x,y,z);
    wall.rotation.z = Math.PI / 2;
    wall.rotation.y = rotation;
    
    scene.add( wall );
    static_surfaces.push(wall);
};

//Hairball Constructor
function Hairball(x,z) {

    var box_material = Physijs.createMaterial(
	new THREE.MeshLambertMaterial({ color: 0xFF66FF }),
	0.9,
	0.2);

    var box = new Physijs.BoxMesh(
	new THREE.BoxGeometry( 10, 10, 10 ),
	box_material,
	30
    );

    box.position.set(x, -9.5, z);
    box.castShadow = true;
    box.receiveShadow = true;

    scene.add( box );
    moveable_objects.push( box ); 

    var sphere_texture = THREE.ImageUtils.loadTexture('app/assets/textures/hair.jpg',THREE.SphericalRefractionMapping);

    sphere_texture.wrapS = sphere_texture.wrapT = THREE.RepeatWrapping;
    sphere_texture.repeat.set(3,3);

    var sphere_material = Physijs.createMaterial(
	new THREE.MeshPhongMaterial({ map: sphere_texture, ambient: 0x904716 }),
	0.5,
	0.9);
    
    
    var sphere = new Physijs.SphereMesh(
	new THREE.SphereGeometry(5,20,20),
	sphere_material,
	9
    );

    sphere.position.set(x, 0.3, z);
    sphere.castShadow = true;
    sphere.receiveShadow= true;
    
    scene.add( sphere );
    moveable_objects.push( sphere );
}
//end hairball constructor

function Armature(x,z) {
    var armature = new Physijs.BoxMesh(
	new THREE.BoxGeometry( 4, 4, 4 ),
	new THREE.MeshLambertMaterial({ color: 0xEEEEEE }),
	9
    );

    armature.position.set(x,-12.5, z);
    armature.castShadow = true;
    armature.receiveShadow= true;

    scene.add( armature );

    var _v3 = new THREE.Vector3(0,0,0);
    armature.setAngularFactor(_v3);
    armature.setLinearFactor(_v3);

    intersect_cylinder = new THREE.Mesh(
	new THREE.CylinderGeometry(0.3,0.3,45.8),
	new THREE.MeshLambertMaterial()
    );

    intersect_cylinder.position.set(x, 5,z);
    intersect_cylinder.castShadow = true;
    intersect_cylinder.receiveShadow = true;

    scene.add(intersect_cylinder);

    var olives = [];

    function OliveCreator(num) {

	var olive_loader = new THREE.PLYLoader();

	var olive_material = new Physijs.createMaterial (
	    new THREE.MeshLambertMaterial({ color: 0x66CC00}),
	    0.5,
	    0.5
	);

	// The issue with the olive meshes was the same as the one we'd seen before
	// When dealing with these meshes, we have to transform the geometry BEFORE creating a new Physijs mesh
	// It's also more efficient, but that's beside the point
	var olive = olive_loader.load('./app/assets/ply/ascii/Olive.ply', function( geometry ){

	    var m = new THREE.Matrix4();
	    var m1 = new THREE.Matrix4();

	    m.makeRotationX( Math.PI/2 );
	    m1.makeRotationZ( Math.PI/2 );

	    m.multiply( m1 );

	    geometry.applyMatrix(m);
	    geometry.computeBoundingBox();

	    // Bounding sphere radius doesn't seem accurate in this instance
	    var radius = geometry.boundingBox.max.y - geometry.boundingBox.min.y;

	    // Need to find a solution to this
	    // Can see my attempt here, what am I missing?
	    var armature_y = -7.6; //armature.position.y + (armature.geometry.boundingBox.max.y - armature.geometry.boundingBox.min.y);

	    for (var i = 0; i < num; i++) {

		var y = armature_y + (olives.length * (radius));

		var oliveMesh = new Physijs.CylinderMesh(
		    geometry,
		    olive_material,
		    5
		);

		oliveMesh.castShadow = true;
		oliveMesh.receiveShadow = true;

		oliveMesh.position.set(armature.position.x, y, armature.position.z);
		oliveMesh.scale.set(0.6,0.55,0.6);

		scene.add( oliveMesh );

		var _v3 = new THREE.Vector3(0,1,0);
		oliveMesh.setAngularFactor(new THREE.Vector3(0,1,0));
		oliveMesh.setLinearFactor(_v3);

		olives.push(oliveMesh);
		moveable_objects.push(oliveMesh);

		if (olives.length == num){
		    sculpture = new Sculpture( armature, olives);
		}
	    }
	});

    }

    OliveCreator(13);

}

function Egg(x,z) {
    var armature = new Physijs.BoxMesh(
		new THREE.BoxGeometry( 5, 1, 5 ),
		new THREE.MeshLambertMaterial({ color: 0xEEEEEE }),
		9
    );

    armature.position.set(x,-14, z);
    armature.castShadow = true;
    armature.receiveShadow= true;
    
    scene.add( armature );

    var _v3 = new THREE.Vector3(0,0,0);
    armature.setAngularFactor(_v3);
    armature.setLinearFactor(_v3);

    intersect_cylinder = new THREE.Mesh(
		new THREE.CylinderGeometry(0.5,0.5,40.8),
		new THREE.MeshLambertMaterial()
	);

    intersect_cylinder.position.set(x,3,z);
    intersect_cylinder.castShadow = true;
    intersect_cylinder.receiveShadow = true;

    scene.add(intersect_cylinder);

    var eggs = [];
    
    function EggCreator(num) {
    
    	var egg_loader = new THREE.PLYLoader();

    	var egg_material = new Physijs.createMaterial (
		    new THREE.MeshLambertMaterial({ color: 0xFFFFFF}),
		    0.1,
		    0.7
		);
	
	var egg = egg_loader.load('./app/assets/ply/ascii/olive.ply', function( geometry ){
	    
	for (var i = 0; i < num; i++){
	    var y = -8 + (eggs.length*10);

	   
	    
	    var eggMesh = new Physijs.CylinderMesh(
		new THREE.CylinderGeometry(4,4,10,20),
		egg_material,  
		5
	    );
	    eggMesh.castShadow = true;
	    eggMesh.receiveShadow = true;

	    eggMesh.position.set(armature.position.x, y, armature.position.z);
	    eggMesh.rotation.x=Math.PI / 2;
	    if (i%2==0) eggMesh.rotation.z = Math.PI/2;
	    // return olive1;
	    scene.add( eggMesh );

	    var _v3 = new THREE.Vector3(0,1,0);
	    eggMesh.setAngularFactor(new THREE.Vector3(0,0,0));
	    eggMesh.setLinearFactor(_v3);

	    eggs.push(eggMesh);
	    moveable_objects.push(eggMesh);

	    if (i==num-1) {
		sculpture = new Sculpture( armature, eggs);
	    }
	}
	});			
    }

    EggCreator(5);


}


// relates armature and modules
var Sculpture = function(armature,modules) {
    this.armature = armature;
    this.modules = modules;
    
    sculptures.push(this);
    moveable_objects.push(modules[modules.length-1]);
};

//handles resizing of the window
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}


//user input
initEventHandling = (function() {
    var _vector = new THREE.Vector3();
    var raycaster = new THREE.Raycaster();
    var handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown;
    var thing_offset = new THREE.Vector3, 
    
    handleMouseDown = function( evt ) {
	var intersections
	
	_vector.set((evt.clientX / window.innerWidth) * 2 - 1,
		    -(evt.clientY / window.innerHeight ) * 2 + 1,
		   1);
	
	raycaster.setFromCamera(_vector, camera);
	intersections = raycaster.intersectObjects( moveable_objects ); 

	if (intersections.length > 0) {
	    selected_thing = intersections[0].object;
	    
	    // if it is on a sculpture, pop it and make it dynamic
	    for (i = 0; i < sculptures.length; i++) {
		if (sculptures[i].modules.indexOf(selected_thing) >= 0) {
		    sculptures[i].modules.splice(sculptures[i].modules.indexOf(selected_thing),1);
		    break;
		}
	    }

	    
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

	    var sculpture;
	    var collisionResults;

	    _vector.set((evt.clientX / window.innerWidth) * 2 - 1,
			-(evt.clientY / window.innerHeight ) * 2 + 1,
			1);

	    raycaster.setFromCamera(_vector, camera);

	    //iterates through sculpture objects
	    for (i = 0; i < sculptures.length; i++) {
		collisionResults = raycaster.intersectObjects(sculptures[i].modules.concat(sculptures[i].armature));
		if (collisionResults.length !== 0) {
		    sculpture = sculptures[i];
		    break;
		}
	    }


	    if ( collisionResults.length !== 0) {
		if (sculpture.modules.length == 0) {
		    var snap_y = -12 + selected_thing.geometry.boundingSphere.radius;
		}
		else {
		    var snap_y = sculpture.modules[sculpture.modules.length-1].position.y
		        + sculpture.modules[sculpture.modules.length-1].geometry.boundingBox.max.y
		        + selected_thing.geometry.boundingBox.max.y;
		}

		selected_thing.__dirtyPosition = true;

		//put object in position
		selected_thing.position.x=sculpture.armature.position.x;
		selected_thing.position.y=snap_y;
		selected_thing.position.z=sculpture.armature.position.z;


		//make object static
		var _v3 = new THREE.Vector3(0,1,0);
		selected_thing.setAngularFactor(_v3);
		selected_thing.setLinearFactor(_v3);
		_v3 = new THREE.Vector3(0,0,0);
		selected_thing.setLinearVelocity(_v3);


		//finally, push selected_thing on the sculpture stack
		sculpture.modules.push(selected_thing);


	    }
	    //end snapping
	    
	    selected_thing = null;
	}
    };

    //rotate camera
    handleKeyDown =  function( evt ){

	var x = camera.position.x,
	    y = camera.position.y,
	    z = camera.position.z;

	var rotSpeed = 0.05;
	
	//left
	if (evt.keyCode=="37"){
	    camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
	    camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
	}
	//right
	else if (evt.keyCode=="39"){
	    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
	    camera.position.z = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
	}

	camera.lookAt(scene.position);

    }


    return function() {
	renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
	renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
	renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
	renderer.domElement.addEventListener( 'keydown', handleKeyDown );
    };
})();



window.onload = initScene;

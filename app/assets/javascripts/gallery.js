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

// initScene = function() {
//     renderer = new THREE.WebGLRenderer({antialias:true});
//     renderer.setSize( window.innerWidth, window.innerHeight );
//     document.body.appendChild(renderer.domElement);

//     scene = new Physijs.Scene;

//     camera = new THREE.PerspectiveCamera(
// 	35,
// 	window.innerWidth / window.innerHeight,
// 	1,
// 	1000
//     );

//     camera.position.set(60,50,60);
//     camera.lookAt(scene.position);
//     scene.add(camera);

//     box = new Physijs.BoxMesh(
// 	new THREE.CubeGeometry( 5, 5, 5 ),
// 	new THREE.MeshBasicMaterial({ color: 0x888888 })
//     );
//     scene.add( box );

//     requestAnimationFrame( render );
// };

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

    
// How we can load new models using OBJLoader which I put in the javascripts dir

// var manager = new THREE.LoadingManager();
// var loader = new THREE.OBJLoader( manager );
// loader.load( 'obj/'+filename, function ( object ) {
//     Main._geometry = object.children[0].geometry;
    
//     //normalize to [-normal_R,normal_R]
//     var normal_R = 5;
//     var minV = 1e100, maxV = -1e100;
//     var positions = Main._geometry.attributes.position.array;
    
//     for(var i=0;i < positions.length;i++) {
//         minV = Math.min(minV,positions[i]);
//         maxV = Math.max(maxV,positions[i]);
//     }
//     for(var i=0;i < positions.length;i++) {
//         positions[i] = ( positions[i] - minV ) / (maxV - minV) * 2 * normal_R - normal_R;
//     }
    
//     //move to center
//     for(var i=0;i <3;i++) {
//         var avg_position = 0.0;
//         var avg_tot = 0;
//         for(var j=i;j < positions.length;j+=3) {
//             avg_position += positions[j];
//             avg_tot ++; 
//         }
//         avg_position /= avg_tot;
//         for(var j=i;j < positions.length;j+=3) positions[j] -= avg_position;
//     }
    
    
//     Main.controlsChangeCallback();

//     if ( callback !== undefined ) callback();
// });

    requestAnimationFrame( render );
};

render = function() {
    scene.simulate(); // run physics
    renderer.render( scene, camera); // render the scene
    requestAnimationFrame( render );
};

window.onload = initScene;






// if we want to use glsl shaders for textures we can rewrite the following two functions to do so
// could get really cool effects

// Parser.parseTxt = function( textFile ) {
//     var request = new XMLHttpRequest();
//     request.open("GET", textFile, false);
//     request.overrideMimeType('text/plain');
//     request.send(null);
//     return request.responseText;
// };


// Main.shadingMethod = Gui.values.shadingModel;

// var meshs = [];

// var uniforms = {
//         inflate : {type: 'f', value: Gui.values.inflate},
//         ambient :     { type: "c", value: new THREE.Color( Gui.values.ambient ) },
//         diffuse :     { type: "c", value: new THREE.Color( Gui.values.diffuse ) },
//         specular :     { type: "c", value: new THREE.Color( Gui.values.specular ) },
//         lightDir : {type: "v3", value : Renderer.lightDir},
//         texture : {type: 't', value: Main.fetchTexture(Gui.values.texture) },
//         shininess: {type: 'f', value: Gui.values.shininess},
// };

// Main._material = new THREE.ShaderMaterial( {
//     uniforms:       uniforms,
//     vertexShader:   Parser.parseTxt('shaders/'+Main.shadingMethod+"-vert.txt"),
//     fragmentShader: Parser.parseTxt('shaders/'+Main.shadingMethod+"-frag.txt"),
// });
// meshs.push( new THREE.Mesh(Main._geometry,Main._material) );
    
// Renderer.updateScene( meshs );

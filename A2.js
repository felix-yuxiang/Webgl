/*
 * UBC CPSC 314, 2021WT1
 * Assignment 2 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms

const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };

//HINT: Use this is uniform to pass a rotation matrix to a vertex shader to animate the armadillo's pelvis
const rotationMatrix = {type: 'mat4', value: new THREE.Matrix4()};

//HINT: Q1(b) Change this to a uniform, to pass time to a vertex shader to animate the icecream.
// Make corresponding changes in the update function
time = 0;


// Constant for rotation angle (speed) and moving speed of the armadillo
const angle = 0.1;
const movepace = 0.3;

// Materials: specifying uniforms and shaders

const sphereMaterial = new THREE.ShaderMaterial();

const coneMaterial = new THREE.ShaderMaterial();

const eyeMaterial = new THREE.ShaderMaterial();

const virusMaterial = new THREE.ShaderMaterial();

const armadilloFrame = new THREE.Object3D();
armadilloFrame.position.set(0, 0, -8);

const eyeFrame = new THREE.Object3D();
eyeFrame.position.set(0, 5.3, 0);

const virusFrame = new THREE.Object3D();
virusFrame.position.set(0,0,0);



scene.add(armadilloFrame);

scene.add(virusFrame);

const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightOffset: lightOffset,
    rotationMatrix: rotationMatrix
  }
});

// Load shaders.t
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl',
  'glsl/cone.vs.glsl',
  'glsl/cone.fs.glsl',
  'glsl/virus.vs.glsl',
  'glsl/virus.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

  coneMaterial.vertexShader = shaders['glsl/cone.vs.glsl'];
  coneMaterial.fragmentShader = shaders['glsl/cone.fs.glsl'];

  virusMaterial.vertexShader = shaders['glsl/virus.vs.glsl'];
  virusMaterial.fragmentShader = shaders['glsl/virus.fs.glsl'];

});

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, armadilloFrame, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.position.y = 5.3
  armadillo.scale.set(0.1, 0.1, 0.1);

  const armadilloAxes = new THREE.AxesHelper(10);
  armadillo.add(armadilloAxes);
});

// loadAndPlaceOBJ('obj/virus.obj', virusMaterial, virusFrame, function (virus) {
//   virus.position.y = 10;
//   virus.position.z = 4;
//   virus.scale.set(10, 10, 10);
// });

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('obj/');
mtlLoader.load('virus.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('obj/');
  objLoader.load('virus.obj', function(virus) {
    virus.position.y = 10;
  virus.position.z = 4;
  virus.scale.set(10, 10, 10);
  virusFrame.add(virus);
  });
});

// Create the icecream scoop geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

const coneGeometry = new THREE.ConeGeometry(1, 3, 32);
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

//HINT: Add the sphere as a child to the cone

cone.position.set(0, 12, 1);
cone.rotation.z = Math.PI;
sphere.position.set(0, -1.5, 0);
cone.add(sphere);
// Add a cone model frame axeshelper
const coneFrame = new THREE.AxesHelper(2);
cone.add(coneFrame);

// Add a armadillo frame axeshelper
const armadilloAxes = new THREE.AxesHelper(2);
armadilloFrame.add(armadilloAxes);

// Add a eyes frame axeshelper
const eyeAxes = new THREE.AxesHelper(8);
eyeFrame.add(eyeAxes);


// Eyes (Q1c)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);

// HINT: Replace the following with two eye ball meshes from the same geometry.

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);

leftEye.position.set(-1.4, 6.7, -3.2); // y z x
rightEye.position.set(1.4, 6.7, -3.2);
eyeFrame.add(leftEye);
eyeFrame.add(rightEye);

eyeFrame.rotation.y = Math.PI;

armadilloFrame.add(eyeFrame);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();


let rotateEye = new THREE.Matrix4();


function checkKeyboard() {

  //HINT: Use keyboard.pressed to check for keyboard input. 
  //Example: keyboard.pressed("A") to check if the A key is pressed.

  // W and S control the translation of armadillo along z axis
  if (keyboard.pressed("W")) {
    armadilloFrame.position.z += movepace;
  } else if (keyboard.pressed("S")) {
    armadilloFrame.position.z -= movepace;
  }

  // Move the armadillo left or right
  if (keyboard.pressed("Z")) {
    armadilloFrame.position.x += movepace;
  } else if (keyboard.pressed("C")) {
    armadilloFrame.position.x -= movepace;
  }

  // A and D rotates the armadillo left and right respectively.
  if (keyboard.pressed("A")) { 
    rotateEye.makeRotationY(angle);
    rotationMatrix.value.multiply(rotateEye);
    // rotates only when there is modification for thetaxy
    
    eyeFrame.rotateY(angle);
    
  } else if (keyboard.pressed("D")) {
    rotateEye.makeRotationY(-angle);
    rotationMatrix.value.multiply(rotateEye);

    eyeFrame.rotateY(-angle);
  }

  // Q and E rotates the armdillo forward and backward respectively.
  if (keyboard.pressed("Q")) { 
    rotateEye.makeRotationX(angle);
    rotationMatrix.value.multiply(rotateEye);

    eyeFrame.rotateX(0.1);
  } else if (keyboard.pressed("E")) {
    rotateEye.makeRotationX(-angle);
    rotationMatrix.value.multiply(rotateEye);

    eyeFrame.rotateX(-angle);
  }


  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  coneMaterial.needsUpdate = true;

}

// HINT: Use one of the lookAt funcitons available in three.js to make the eyes look at the ice cream.

// Setup update callback
function update() {
  checkKeyboard();

  //HINT: Q1(b) Use time to animate the ice cream cone.
  // When you define time as a uniform, remember to replace this with its value
  time += 1/60; //Assumes 60 frames per second
  // Set up the amplitude of 8-figure
  am = 8;
  cone.position.set( am*Math.cos(time), 12 + am*Math.cos(time)*Math.sin(time), 1);

  virusFrame.scale.set(Math.abs(Math.cos(time)), Math.abs(Math.cos(time)), Math.abs(Math.cos(time)));
  virusFrame.position.set(am*Math.cos(time), 12 + am*Math.cos(time)*Math.sin(time), 1);

  leftEye.lookAt(virusFrame.position);
  rightEye.lookAt(virusFrame.position);

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();

import * as THREE from '/assets/js/three.module.min.js';

const parent = document.getElementById('waveform_container');
const canvas = document.getElementById('waveform');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);

let time = Date.now() / 1000 - 1684951075;
let lastTime = Date.now() / 1000 - 1684951075;
let scrollOffsetVar = 0.0;
let scrollOffsetVelocity = 0.0;
let lastScrollY = window.scrollY;
const renderer = new THREE.WebGLRenderer({ canvas: canvas/*, antialias: true */});
renderer.setClearColor( 0xffffff, 1);
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, material);
// scene.add(cube);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 8;
camera.lookAt(new THREE.Vector3());
renderer.setSize( window.innerWidth, window.innerHeight );

const geometry = new THREE.CylinderGeometry(0.03, 0.03, 11, 8, 280, true);

// array of [offsetConstant, rotationConstant, timeMultiplier, length]
let bandArms;
bandArms = [
  [
    ['0.0', '6.2', '0.067', '1.0'],
    ['0.0', '12.6', '0.05', '0.6'],
    ['0.0', '30.0', '0.125', '0.3'],
  ],
  [
    ['0.0', '6.2', '0.067', '1.0'],
    ['0.0', '12.6', '0.05', '0.6'],
    ['0.0', '30.0', '0.125', '0.3'],
    ['0.0', '30.0', '0.5', '0.2'],
  ],
  [
    ['0.0', '6.2', '0.067', '1.0'],
    ['0.0', '12.6', '0.05', '0.6'],
    ['0.0', '30.0', '0.125', '0.3'],
    ['0.0', '10.0', '0.5', '0.1'],
  ],
];

const vertexCode = document.getElementById( 'vertex_shader' ).textContent;
const fragmentCode = document.getElementById( 'fragment_shader' ).textContent;

const uniforms = bandArms.map((bandArm, index) => {
  return {
    time: {
      value: 0.0,
      type: 'f'
    },
    expansion: {
      value: 0.0,
      type: 'f'
    },
    hue: {
      value: index * 0.01,
      // value: 0.0,
      type: 'f'
    }
  }
});

const materials = bandArms.map((bandArm, index) => {
  const armCode = bandArm.map((arm) => {
    return `newPosition += arm( ${arm[0]} + uv.y * ${arm[1]} - time * ${arm[2]}, ${arm[3]});`
  }).join("\n  ");
  const interpolatedVertexCode = vertexCode.replace('//[ArmCalc]', armCode);
  return new THREE.ShaderMaterial({
    uniforms: uniforms[index],
    vertexShader: interpolatedVertexCode,
    fragmentShader: fragmentCode,
    depthTest: false,
    transparent: true,
    // blending: THREE.additiveBlending,

  });
});

materials.forEach(material => {
  const mesh = new THREE.Mesh( geometry, material);
  scene.add(mesh);
});


const cameraTrackRadius = 2.0;

// Resize
(function() {
  const resizeCanvas = () => {
    const parent = document.getElementById('waveform_container');

    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.fov = 45.0 / Math.max(1.0,camera.aspect);

    // we want to slight expand the lines on small screens (i suppose!)
    let expansionAmount = 0.3 * Math.max(1500.0 - parent.clientWidth - parent.clientHeight, 0.0) / 1500.0;

    uniforms.forEach(uniform => {
      uniform.expansion.value = expansionAmount;
    });

    let cameraRotation = Math.PI / 2 -Math.atan(camera.aspect);
    cameraRotation = (cameraRotation * 0.65) + (Math.PI * 0.35 / 8);
    camera.up.set(Math.cos(cameraRotation), Math.sin(Math.PI - cameraRotation), 0);
    camera.updateProjectionMatrix();

    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 0.5;
    const desiredWidth = parent.clientWidth * pixelRatio | 0;
    const desiredHeight = parent.clientHeight * pixelRatio | 0;
    renderer.setSize(desiredWidth, desiredHeight, false);
    // camera.aspect = window.innerWidth / window.innerHeight;
  }
  window.onresize = (event) => { resizeCanvas(); };

  resizeCanvas();
})();


let frames = 0;

function animate() {
  frames++;

  requestAnimationFrame( animate );
  time = Date.now() / 1000 - 1684951075;
  scrollOffsetVar += scrollOffsetVelocity / 100.0;

  if (time - lastTime >= 1.0) {
    console.log(frames);
    frames = 0;
    lastTime = time;
  }

  scrollOffsetVelocity *= 0.95;

  uniforms.forEach(uniform => {
    uniform.time.value = time + scrollOffsetVar;
  });
  camera.position.x = Math.cos(time / 1.0) * cameraTrackRadius;
  camera.position.y = Math.sin(time / 1.0) * cameraTrackRadius;

  camera.lookAt(new THREE.Vector3());
  camera.updateProjectionMatrix();
  renderer.render( scene, camera );
}
animate();

addEventListener("scroll", (event) => {

  scrollOffsetVelocity += Math.min(10.0, Math.abs(window.scrollY - lastScrollY) / 20.0);
  lastScrollY = window.scrollY;
});

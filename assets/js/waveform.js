import * as THREE from './three.module.min.js';

const parent = document.getElementById('waveform_container');
const canvas = document.getElementById('waveform');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);

const startTime = Date.now();

let time = Date.now() / 1000 - 1684951075;
let lastTime = Date.now() / 1000 - 1684951075;
let scrollOffsetVar = 0.0;
let scrollOffsetVelocity = 0.0;
let lastScrollY = window.scrollY;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

renderer.setClearColor( 0xffffff, 0);
renderer.autoClear = false;
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, material);
cube.position.z = 0.0;
// scene.add(cube);
camera.position.y = 0;
camera.position.z = 15;
renderer.setSize( window.innerWidth, window.innerHeight );

const torusRadius = 10.0;
const geometry = new THREE.TorusGeometry(torusRadius, 0.02, 9, 830, Math.PI * 3 / 4);

// array of [offsetConstant, rotationConstant, timeMultiplier, length]
let bandArms;

bandArms = [
  // [], // basic shape with no waves
  [
    ['0.0', '6.2', '33.0', '1.0'],
    ['3.4', '-7.9', '63.0', '0.8'],
    ['4.4', '9.1', '-18.0', '0.7'],
    ['5.4', '14.1', '11.23', '0.4'],
    ['5.4', '34.1', '25.6', '0.3'],
    ['5.4', '53.1', '250.0', '0.23'],
  ],
  [
    ['0.0', '6.2', '33.0', '1.0'],
    ['3.4', '-7.9', '63.0', '0.8'],
    ['4.4', '9.1', '-18.0', '0.7'],
    ['5.4', '14.1', '11.23', '0.4'],
  ],
  [
    ['0.5', '6.2', '33.0', '1.0'],
    ['3.4', '-7.9', '63.0', '0.8'],
    ['4.4', '9.1', '-18.0', '0.7'],
    ['5.4', '14.1', '11.23', '0.4'],
    ['5.4', '34.1', '-25.6', '0.3'],
  ],
  [
    ['1.0', '6.2', '33.0', '1.0'],
    ['3.4', '-7.9', '63.0', '0.8'],
    ['4.4', '9.1', '-23.0', '0.7'],
  ],
];

let randomOffsets = Array(Math.max(...bandArms.map(x => x.length))).fill().map(x => Math.random() * 9.0);

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
    },
    faded: {
      value: Math.min(window.scrollY / 200.0, 1.0),
      // value: 0.0,
      type: 'f'
    }
  }
});

const materials = bandArms.map((bandArm, index) => {
  const armCode = bandArm.map((arm, armIndex) => {
    return `newPosition += arm( ${randomOffsets[armIndex]} + uv.x * ${arm[1]} - time / ${arm[2]}, ${arm[3]});`
  }).join("\n  ");
  const interpolatedVertexCode = vertexCode.replace('//[ArmCalc]', armCode);
  console.log(interpolatedVertexCode);
  return new THREE.ShaderMaterial({
    uniforms: uniforms[index],
    vertexShader: interpolatedVertexCode,
    fragmentShader: fragmentCode,
    depthTest: false,
    transparent: true,
    // blending: THREE.additiveBlending,
    // blending: THREE.multiplicativeBlending,

  });
});

materials.forEach(material => {
  const mesh = new THREE.Mesh( geometry, material);
  mesh.rotation.x = -Math.PI / 2.0;
  scene.add(mesh);
});

// Resize
(function() {
  const resizeCanvas = () => {
    const parent = document.getElementById('waveform_container');

    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.fov = 25.0 / Math.max(1.0,camera.aspect);

    // we want to slight expand the lines on small screens (i suppose!)
    let expansionAmount = 0.15 * Math.max(1500.0 - parent.clientWidth - parent.clientHeight, 0.0) / 1500.0;

    uniforms.forEach(uniform => {
      uniform.expansion.value = expansionAmount;
    });

    let cameraRotation = -Math.PI / 4 - Math.atan(camera.aspect);
    cameraRotation = (cameraRotation * 0.65) + (Math.PI * 0.35 / 8);
    camera.up.set(-Math.cos(cameraRotation), -Math.sin(Math.PI - cameraRotation), 0);

    camera.position.x = torusRadius / 3;
    camera.lookAt(torusRadius / 3, 0, 0);
    camera.updateProjectionMatrix();

    // const pixelRatio = window.devicePixelRatio;
    const pixelRatio = 1.0;
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

  time = (Date.now() - startTime) / 1000.0;
  // console.log(time);
  scrollOffsetVar += scrollOffsetVelocity / 100.0;

  if (time - lastTime >= 1.0) {
    console.log(frames);
    frames = 0;
    lastTime = time;
  }

  scrollOffsetVelocity *= 0.97;

  let shaderTime = Math.round(time * 100.0) / 100.0 + scrollOffsetVar * 4.0;
  shaderTime = time + scrollOffsetVar * 4.0;
  uniforms.forEach(uniform => {
    uniform.time.value = shaderTime;
  });

  camera.updateProjectionMatrix();
  renderer.clear();
  renderer.render( scene, camera );
}
animate();

addEventListener("scroll", (event) => {

  uniforms.forEach(uniform => {
    uniform.faded.value = Math.min(window.scrollY / 200.0, 1.0);
  });

  scrollOffsetVelocity += Math.min(1.0, Math.abs(window.scrollY - lastScrollY) / 40.0);
  lastScrollY = window.scrollY;
});

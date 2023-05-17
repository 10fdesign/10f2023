import * as THREE from 'three';

const parent = document.getElementById('waveform_container');
const canvas = document.getElementById('waveform');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setClearColor( 0xffffff, 1);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 5;
scene.add(cube);
renderer.setSize( window.innerWidth, window.innerHeight );

// Resize
(function() {
  const resizeCanvas = () => {
    const parent = document.getElementById('waveform_container');


    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();

    const pixelRatio = window.devicePixelRatio;
    const desiredWidth = parent.clientWidth * pixelRatio | 0;
    const desiredHeight = parent.clientHeight * pixelRatio | 0;
    renderer.setSize(desiredWidth, desiredHeight, false);
    console.log(pixelRatio, ' ', desiredWidth, ' ', desiredHeight);
    // TODO: set camera perspective here as well maybe?
    // camera.aspect = window.innerWidth / window.innerHeight;
  }
  window.onresize = (event) => { resizeCanvas(); };

  resizeCanvas();
})();

function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();

import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Outline2DShader } from './shaders/Outline2DShader';

// Canvas
const canvas = document.querySelector('canvas.webgl');

//init variables
const textureLoader = new THREE.TextureLoader();
const sampleImage = textureLoader.load('./assets/Flower.png');

//#region  Scene and renderers

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x7a7a7a );

const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 0.8);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  format: THREE.RGBAFormat, // Ensure we store alpha channel
  transparent: true,
  premultipliedAlpha: false
});

//#endregion

const OutlineProperties = {
  _spriteTex: { value: sampleImage },   
  _outlineThickness: { value: 10.0 },
  _outlineColor: { value: new THREE.Color(0x00ff00)},
  _outlineOpacity: { value: 1.0 },
  _ringCount: { value: 16 }, // number of alpha samples around a point
  _offset: { value: new THREE.Vector2(0, 0) },
  _squareBorder: { value: false }, // useful for pixel sprites
  _isSecondPass: { value: false } // false: if directly applied to a sprite, true: if applied as a second pass
}

const outlineMaterial = new THREE.ShaderMaterial({    
  uniforms: OutlineProperties,
  vertexShader: Outline2DShader.vertexShader,
  fragmentShader: Outline2DShader.fragmentShader,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(1, 1);
const plane = new THREE.Mesh(geometry, outlineMaterial);
scene.add(plane);

const sprite = new THREE.Sprite( outlineMaterial ); // you may use a sprite instead of a plane
//scene.add(sprite);

// Handle window resize
window.addEventListener('resize', () => {
    sizes.width = canvas.clientWidth;
    sizes.height = canvas.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
});

//#region Dat GUI

const gui = new dat.GUI();

function addColorControl(gui, obj, propName, name) {
  const colorProxy = { color: `#${obj[propName].value.getHexString()}` };
  gui.addColor(colorProxy, 'color').name(name).onChange(value => {
      obj[propName].value.set(value);
  });
}

const outlineFolder = gui.addFolder('Outline Properties');
addColorControl(outlineFolder, OutlineProperties, '_outlineColor', 'Outline Color');
outlineFolder.add(OutlineProperties._outlineThickness, 'value', 0, 100, 0.1).name('Outline Thickness');
outlineFolder.add(OutlineProperties._outlineOpacity, 'value', 0, 1, 0.01).name('Outline Opacity');
outlineFolder.open();

const outlineAdvancedFolder = gui.addFolder('Outline Properties Advanced');
outlineAdvancedFolder.add(OutlineProperties._ringCount, 'value', 0, 100, 1).name('Ring Count');

//#endregion


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}

animate();


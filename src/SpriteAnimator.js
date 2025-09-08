import * as THREE from 'three';
import { SpriteAnimatorShader } from './shaders/SpriteAnimatorShader';

// Select DOM elements
const spriteFileInput = document.getElementById('spriteFileInput');
const jsonFileInput = document.getElementById('jsonFileInput');
const spriteFileStatus = document.getElementById('spriteFileStatus');
const jsonFileStatus = document.getElementById('jsonFileStatus');

// Canvas
const canvas = document.querySelector('canvas.webgl');

//init variables
const textureLoader = new THREE.TextureLoader();
let spritesheet = null;
let frames = [];
let atlasSize = { w: 0, h: 0 };
let isDataLoaded = false;
let frameRate = 25;
let frameDuration = 1000 / frameRate;

//load json function
function loadJSON(path) {
    return fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
  }


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
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

//#endregion

const material = new THREE.ShaderMaterial({    
    uniforms: {       
      _spriteAtlasTex: { value: null }, // sprite from texture packer
      _frame: { value: new THREE.Vector4(0, 0, 0, 0) }, // frame   
      _spriteAtlasSize: { value: new THREE.Vector2(0, 0) }, // size
      _sourceSize: { value: new THREE.Vector2(0, 0) }, // sourceSize
      _spriteSourceSize: { value: new THREE.Vector4(0, 0, 0, 0) }, // spriteSourceSize
      _isRotated: {value: false} // rotated
           
    },
    vertexShader: SpriteAnimatorShader.vertexShader,
    fragmentShader: SpriteAnimatorShader.fragmentShader,
    transparent: true,
});

const sprite = new THREE.Sprite(material);
scene.add(sprite);

// Handle window resize
window.addEventListener('resize', () => {
    sizes.width = canvas.clientWidth;
    sizes.height = canvas.clientHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
});

let currentFrame = 0;
let lastFrameTime = Date.now();
function animate() {
    requestAnimationFrame(animate);

    const now = Date.now();

    //if json data loaded, set the material uniforms
    if (isDataLoaded && (now - lastFrameTime >= frameDuration)) {
      currentFrame = (currentFrame + 1) % frames.length;
      const frame = frames[currentFrame].frame;
      const sourceSize = frames[currentFrame].sourceSize;
      const spriteSourceSize = frames[currentFrame].spriteSourceSize;
      const rotated = frames[currentFrame].rotated;
      material.uniforms._frame.value.set(frame.x, frame.y, frame.w, frame.h);
      material.uniforms._sourceSize.value.set(sourceSize.w, sourceSize.h);
      material.uniforms._spriteSourceSize.value.set(spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h);
      material.uniforms._isRotated.value = rotated;
      lastFrameTime = now;

      //scale the plane acording to the source aspect ratio
      const aspect = sourceSize.w/sourceSize.h;
      if(aspect > 1.0){
        plane.scale.set(1.0, 1.0/aspect, 1.0);
      }else
        plane.scale.set(aspect, 1.0, 1.0);
    }

    renderer.render(scene, camera);
}

animate();


/* ------------------------------------------------------------------
   FILE INPUT LOGIC
------------------------------------------------------------------ */

// Load a local sprite (png/jpg) file
spriteFileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const localURL = URL.createObjectURL(file);
  spritesheet = textureLoader.load(localURL, () => {
    spriteFileStatus.textContent = `Sprite loaded: ${file.name}`;
    material.uniforms._spriteAtlasTex.value = spritesheet;
  });
});

// Load a local JSON file
jsonFileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const localURL = URL.createObjectURL(file);

  loadJSON(localURL)
    .then((data) => {
      frames = data.frames;
      atlasSize = data.meta.size;
      material.uniforms._spriteAtlasSize.value.set(atlasSize.w, atlasSize.h);
      isDataLoaded = true;

      jsonFileStatus.textContent = `JSON loaded: ${file.name}`;
    })
    .catch((err) => {
      console.error('Error loading JSON:', err);
    });
});

// frame rate input element
const frameRateInput = document.getElementById('frameRateInput');

frameRateInput.addEventListener('change', (e) => {
  const newFrameRate = parseInt(e.target.value, 10) || 25;
  frameRate = newFrameRate;  
  frameDuration = 1000 / frameRate;
});

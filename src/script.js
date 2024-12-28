import * as THREE from 'three';
import { SpriteShader } from './SpriteShader';

// Canvas
const canvas = document.querySelector('canvas.webgl');

//load spritesheet
const textureLoader = new THREE.TextureLoader();
const spritesheet = textureLoader.load('./assets/img/axeman-run-red.png');

//load json
function loadJSON(path) {
    return fetch(path)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      });
  }

let frames = [];
let atlasSize = { w: 0, h: 0 };
let isDataLoaded = false;

loadJSON('./assets/json/axeman-run-red.json')
    .then(data => {
      frames = data.frames; 
      atlasSize = data.meta.size;
      material.uniforms._spriteAtlasSize.value.set(atlasSize.w, atlasSize.h);
      isDataLoaded = true;
    });


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
        _spriteAtlasTex: { value: spritesheet },
        _spriteAtlasSize: { value: new THREE.Vector2(0, 0) }, // size
        _sourceSize: { value: new THREE.Vector2(0, 0) }, // sourceSize
        _spriteSourceSize: { value: new THREE.Vector4(0, 0, 0, 0) }, // spriteSourceSize
        _frame: { value: new THREE.Vector4(0, 0, 0, 0) } // frame       
    },
    vertexShader: SpriteShader.vertexShader,
    fragmentShader: SpriteShader.fragmentShader,
    transparent: true,
});

const geometry = new THREE.PlaneGeometry(1, 1);
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

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
const frameRate = 25;
const frameDuration = 1000 / frameRate;
let lastFrameTime = Date.now();
function animate() {
    requestAnimationFrame(animate);

    const now = Date.now();

    if (isDataLoaded && (now - lastFrameTime >= frameDuration)) {
      currentFrame = (currentFrame + 1) % frames.length;
      const frame = frames[currentFrame].frame;
      const sourceSize = frames[currentFrame].sourceSize;
      const spriteSourceSize = frames[currentFrame].spriteSourceSize;
      material.uniforms._frame.value.set(frame.x, frame.y, frame.w, frame.h);
      material.uniforms._sourceSize.value.set(sourceSize.w, sourceSize.h);
      material.uniforms._spriteSourceSize.value.set(spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h);
      lastFrameTime = now;
    }

    renderer.render(scene, camera);
}

animate();

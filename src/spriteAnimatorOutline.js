import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SpriteAnimatorShader } from './shaders/SpriteAnimatorShader';
import { Outline2DShader } from './shaders/Outline2DShader';

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

const sampleImage = textureLoader.load('./assets/Flower.png');

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
//scene.background = new THREE.Color( 0x7a7a7a );

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

const SpriteMaterial = new THREE.ShaderMaterial({    
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

const OutlineProperties = {
  _spriteTex: { value: renderTarget.texture },   
  _outlineThickness: { value: 10.0 },
  _outlineColor: { value: new THREE.Color(0x00ff00)},
  _outlineOpacity: { value: 1.0 },
  _ringCount: { value: 16 }, // number of alpha samples around a point
  _offset: { value: new THREE.Vector2(0, 0) },
  _squareBorder: { value: false }, // useful for pixel sprites
  _isSecondPass: { value: true } // false: if directly applied to a sprite, true: if applied as a second pass
}

const outlineMaterial = new THREE.ShaderMaterial({    
  uniforms: OutlineProperties,
  vertexShader: Outline2DShader.vertexShader,
  fragmentShader: Outline2DShader.fragmentShader,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(1, 1);
const plane1 = new THREE.Mesh(geometry, SpriteMaterial);
const plane2 = new THREE.Mesh(geometry, outlineMaterial);
scene.add(plane1);
scene.add(plane2);

const sprite = new THREE.Sprite( outlineMaterial );
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
outlineAdvancedFolder.add(OutlineProperties._isSecondPass, 'value').name('Second Pass');

//#endregion

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
      SpriteMaterial.uniforms._frame.value.set(frame.x, frame.y, frame.w, frame.h);
      SpriteMaterial.uniforms._sourceSize.value.set(sourceSize.w, sourceSize.h);
      SpriteMaterial.uniforms._spriteSourceSize.value.set(spriteSourceSize.x, spriteSourceSize.y, spriteSourceSize.w, spriteSourceSize.h);
      SpriteMaterial.uniforms._isRotated.value = rotated;
      lastFrameTime = now;

      //scale the plane acording to the source aspect ratio
      const aspect = sourceSize.w/sourceSize.h;
      if(aspect > 1.0){
        plane1.scale.set(1.0, 1.0/aspect, 1.0);
        plane2.scale.set(1.0, 1.0/aspect, 1.0);
      }else
        plane1.scale.set(aspect, 1.0, 1.0);
        plane2.scale.set(1.0, 1.0/aspect, 1.0);
    }

    //pass 1 - rendering - sprite with sprite shader to render target
    plane1.visible = true;
    plane2.visible = false;    
    renderer.setRenderTarget(renderTarget);    
    renderer.render(scene, camera);

    //pass 2 - rendering - sprite with outline shader, and with the renderTarget's texture
    plane1.visible = false;
    plane2.visible = true;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
}

animate();

//#region File input

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
    SpriteMaterial.uniforms._spriteAtlasTex.value = spritesheet;
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
      SpriteMaterial.uniforms._spriteAtlasSize.value.set(atlasSize.w, atlasSize.h);
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

//#endregion
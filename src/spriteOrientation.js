import * as THREE from 'three';
import * as dat from 'dat.gui';
import { SpriteOrientShader } from './shaders/SpriteOrientShader';

// Canvas
const canvas = document.querySelector('canvas.webgl');

//init variables
const textureLoader = new THREE.TextureLoader();
const bgTex = textureLoader.load('./assets/Space-Background-Image.jpg');
bgTex.colorSpace = THREE.SRGBColorSpace;
const spriteSheetTex = textureLoader.load('./assets/Home1.png');
//spriteSheetTex.colorSpace = THREE.SRGBColorSpace;

//#region  Scene and renderers

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x7a7a7a );

const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 2.);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);

const renderTarget = new THREE.WebGLRenderTarget(sizes.width, sizes.height, {
  format: THREE.RGBAFormat,
  transparent: true,
  premultipliedAlpha: false
});

//#endregion

const SpriteOrientMaterial = new THREE.ShaderMaterial({    
    uniforms: {       
      _mainTex: { value: spriteSheetTex },
      _mainTint: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
      _orientation: { value: new THREE.Vector3(0.0, 0.0, 0.0)  },
      _time: { value: 0 }, 
      _fps: { value: 12.0 },
      _cols: { value: 1.0 },
      _rows: { value: 1.0 },
      _totalFrames: { value: 1.0 }
    },
    vertexShader: SpriteOrientShader.vertexShader,
    fragmentShader: SpriteOrientShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
});

const bgSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: bgTex }));
bgSprite.scale.set(3.5, 3.5, 1);
const sprite = new THREE.Sprite(SpriteOrientMaterial);
sprite.scale.set(2, 2, 1);
scene.add(bgSprite);
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

//#region Dat GUI

const gui = new dat.GUI();
const orientationFolder = gui.addFolder('Orientation');
orientationFolder.add(SpriteOrientMaterial.uniforms._orientation.value, 'x', -360, 360, 0.1).name('X');
orientationFolder.add(SpriteOrientMaterial.uniforms._orientation.value, 'y', -360, 360, 0.1).name('Y');
orientationFolder.add(SpriteOrientMaterial.uniforms._orientation.value, 'z', -360, 360, 0.1).name('Z');
//orientationFolder.add(SlashMaterial.uniforms._time, 'value', 0, 2, 0.1).name('Time');
orientationFolder.open();

//#endregion

let clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);  
    
    SpriteOrientMaterial.uniforms._time.value = clock.getElapsedTime();

    renderer.render(scene, camera);
}

animate();

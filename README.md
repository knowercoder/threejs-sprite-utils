# Three.js Sprite Utils
This repository consists of scripts and shaders for 2D sprite usage in three.js. [Click here](https://knowercoder.github.io/threejs-sprite-utils/) for the examples.

### Current implementations:
1. [Texture Packer sprite sheet animation](#1-texture-packer-sprite-sheet-animation)
2. [2D sprite outline](#2-2d-sprite-outline)
3. [Texture Packer animator with outline as a second pass](#3-texture-packer-animator-with-outline-as-a-second-pass)
4. [2D sprite orientation](#4-sprite-orientation)

## 1. Texture Packer sprite sheet animation
Sprite animation with the sprite sheet generated from [TexurePacker](https://www.codeandweb.com/texturepacker). Works with trimmed and rotated sprites. The sprite is animated based on the Json (Array) data exported. 

[Live demo](https://knowercoder.github.io/threejs-sprite-utils/spriteAnimator.html). Upload the sprite sheet and the Json file exported from the Texture packer.

<img src="https://github.com/user-attachments/assets/b5f7c8ef-2d3a-483a-abef-03f38814b35b" width="600">

#### How it works:

The sprite is rendered on a sprite with a custom shader material. You can find the shader code in 'src/shaders/SpriteAnimatorShader.js'. The shader will render a single sprite sequence based on input uniforms. Each uniform corresponds to a value from the Json data.

## 2. 2D Sprite Outline
Outline shader for 2D sprite/image.

[Live demo](https://knowercoder.github.io/threejs-sprite-utils/sprite2DOutline.html).
<p align="left">
  <img src="https://github.com/user-attachments/assets/e8457af9-6348-42ae-b3f0-c8c1c9afc23a" alt="ScreenShot" width="250"/>
</p>

## 3. Texture packer animator with outline as a second pass
The outline shader is applied as a second pass to the texture packer shader. So we can have the outline rendered to the animated sprites.

[Live demo](https://knowercoder.github.io/threejs-sprite-utils/spriteAnimatorOutline.html).

## 4. Sprite Orientation
The sprite is rendered by a custom shader at different orientations. You can use this effect in 2D apps, where you don't want to rotate the sprite itself but make it only appear rotated.

[Live Demo](https://knowercoder.github.io/threejs-sprite-utils/spriteOrientation.html).

<img src="https://github.com/user-attachments/assets/e2a309de-03c0-46fb-84db-2f3a1f22bc4b" width="600">


## Thank you
Thanks to [Josema](https://github.com/Josema) for helping me on this project!



# Three.js Sprite Utils
This repository consists of scripts and shaders for 2D sprite usage in three.js. Click here for the examples.

Current implementations:
1. Texture Packer sprite sheet animation
2. 2D Sprite Outline
3. Texture packer animator with outline as second pass

## 1. Texture Packer sprite sheet animation
Sprite animation with the sprite sheet generated from [TexurePacker](https://www.codeandweb.com/texturepacker). Works with trimmed and rotated sprites. The sprite is animated based on the Json (Array) data exported. 

[Live demo](https://knowercoder.github.io/TexturePacker-Animator-Threejs/). Upload the sprite sheet and the Json file exported from the Texture packer.

<p align="left">
  <img src="https://github.com/user-attachments/assets/bfeb872d-a83b-46da-8682-e5b0357cf75e" alt="ScreenShot" width="400"/>
</p>

#### How it works:

The sprite is rendered onto a plane mesh with a custom shader material. You can find the shader code in 'src/SpriteShader.js'. The shader will render a single sprite sequence based on input uniforms. Each uniform corresponds to a value from the Json data.

#### Shader Uniforms:
- _spriteAtlasTex: sprite sheet
- _frame: frame
- _spriteAtlasSize: size
- _sourceSize: sourceSize
- _spriteSourceSize: spriteSourceSize
- _isRotated: rotated

## 2. 2D Sprite Outline
Outline shader for 2D sprite/image.

Live demo.
<p align="left">
  <img src="https://github.com/user-attachments/assets/e8457af9-6348-42ae-b3f0-c8c1c9afc23a" alt="ScreenShot" width="250"/>
</p>

#### Shader Uniforms:
- _outlineColor
- _outlineThickness
- _outlineOpacity

## 3. Texture packer animator with outline as second pass
The outline shader is applied as a second pass to the texture packer shader. So we can have the outline rendered to the animated sprites.

Live demo.

## Thank you
Thanks to [Josema](https://github.com/Josema) for helping me on this project!



# TexturePacker-Animator-Threejs
Sprite animation with the sprite sheet generated from [TexurePackaer](https://www.codeandweb.com/texturepacker), for three.js. Works with trimmed and rotated sprites. The sprite is animated based on the Json (Array) data exported. 

Here is a [Live demo](https://knowercoder.github.io/TexturePacker-Animator-Threejs/). Upload the sprite sheet and the Json file exported from the Texture packer.

<p align="left">
  <img src="https://github.com/user-attachments/assets/bfeb872d-a83b-46da-8682-e5b0357cf75e" alt="ScreenShot" width="400"/>
</p>

## How it works

The sprite is rendered onto a plane mesh with a custom shader material. You can find the shader code in 'SpriteShader.js'. The shader will render a single sprite sequence based on input uniforms. Each uniform corresponds to a value from the Json data.

Shader Uniforms:
- _spriteAtlasTex: sprite sheet
- _frame: frame
- _spriteAtlasSize: size
- _sourceSize: sourceSize
- _spriteSourceSize: spriteSourceSize
- _isRotated: rotated

### Thank you
Special thanks to [Josema](https://github.com/Josema) for heling me on this project!




const SpriteShader = {

    vertexShader: /* glsl */ `
                        
        varying vec2 vUv;
   
        void main() {
        vUv = uv;    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

        }
    `,

    fragmentShader: /* glsl */ `   

    uniform sampler2D _spriteAtlasTex;
    uniform vec2 _spriteAtlasSize;    
    uniform vec2 _sourceSize;
    uniform vec4 _spriteSourceSize;
    uniform vec4 _frame;

    varying vec2 vUv;

    void main() {       

      vec2 uv = vUv;       

      vec4 frame = _frame;

      frame.y = _spriteAtlasSize.y - (frame.y + frame.w);
      vec4 frameNormalized = vec4(frame.xy/_spriteAtlasSize, frame.zw/_spriteAtlasSize);
      vec2 sourceNormalized = _sourceSize/_spriteAtlasSize;

      float offsetx = _spriteSourceSize.x/_spriteAtlasSize.x;
      float offsety = (_sourceSize.y - (_spriteSourceSize.y + _spriteSourceSize.w))/_spriteAtlasSize.y;
      uv = uv * sourceNormalized + frameNormalized.xy - vec2(offsetx, offsety); 
       
      vec4 mainCol = vec4(0.0);
      if(uv.x > frameNormalized.x && uv.x < frameNormalized.x + frameNormalized.z
        && uv.y > frameNormalized.y && uv.y < frameNormalized.y + frameNormalized.w
      )                  
          mainCol = texture(_spriteAtlasTex, uv);
      
      gl_FragColor = mainCol;

    }
  `,

};

export { SpriteShader }
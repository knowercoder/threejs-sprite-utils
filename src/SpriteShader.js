
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
    uniform vec4 _frame;
    uniform vec2 _spriteAtlasSize;    
    uniform vec2 _sourceSize;
    uniform vec4 _spriteSourceSize;
    uniform bool _isRotated;    

    varying vec2 vUv;

    vec2 RotateUV(vec2 uv, float angle, vec2 centre){
      float angleRad = angle * (3.14159265359 / 180.0);      
      float c = cos(angleRad);
      float s = sin(angleRad);
      
      uv -= centre;     
      vec2 rotatedUV;
      rotatedUV.x = uv.x * c - uv.y * s;
      rotatedUV.y = uv.x * s + uv.y * c;
      rotatedUV += centre;

      return rotatedUV;
    }

    void main() {       

      vec2 uv = vUv; 

      vec4 frame = _frame;
      float rotateAngle = 0.0;
      vec2 sourceNormalized = _sourceSize/_spriteAtlasSize;

      if(_isRotated){
        frame = frame.xywz;
        rotateAngle = -90.0;
      }

      frame.y = _spriteAtlasSize.y - (frame.y + frame.w);
      vec4 frameNormalized = vec4(frame.xy/_spriteAtlasSize, frame.zw/_spriteAtlasSize);

      vec2 centre = vec2(frameNormalized.x + frameNormalized.z/2.0, frameNormalized.y + frameNormalized.w/2.0);
      
      vec2 sourceCentre = vec2((_spriteSourceSize.x + _spriteSourceSize.z/2.0)/_spriteAtlasSize.x, 
      (_sourceSize.y - (_spriteSourceSize.y + _spriteSourceSize.w) + _spriteSourceSize.w/2.0)/_spriteAtlasSize.y);

      vec2 offset = sourceCentre;
      if(_isRotated)
        offset = vec2(offset.y, -offset.x);

      uv = uv * sourceNormalized.xy + centre;
      uv = RotateUV(uv, rotateAngle, centre) - offset;

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
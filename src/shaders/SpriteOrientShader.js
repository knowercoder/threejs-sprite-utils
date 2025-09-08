
const SpriteOrientShader = {

    vertexShader: /* glsl */ `

      uniform vec3 _orientation;
                        
      varying vec2 vUv;
      varying vec2 vTexUv;
      varying float vFragPerspective;
      
      mat3 rotateMatrix(float xAngle_deg, float yAngle_deg, float zAngle_deg) {
        float cx = cos(radians(xAngle_deg));
        float sx = sin(radians(xAngle_deg));
        float cy = cos(radians(yAngle_deg));
        float sy = sin(radians(yAngle_deg));
        float cz = cos(radians(zAngle_deg));
        float sz = sin(radians(zAngle_deg));
        
        return mat3(
            cy * cz,                  cy * sz,                 -sy,
            sx * sy * cz - cx * sz,   sx * sy * sz + cx * cz,  sx * cy,
            cx * sy * cz + sx * sz,   cx * sy * sz - sx * cz,  cx * cy
        );
      }
   
      void main() {
        vUv = uv;           

        float tiltAngleX = _orientation.x;
        float tiltAngleY = _orientation.y;
        float tiltAngleZ = _orientation.z;
        mat3 rotation = rotateMatrix(tiltAngleX, tiltAngleY, tiltAngleZ);

        vec3 transformedPos = rotation * position;

        // Apply perspective projection
        float perspective = 1.0 / (1.0 - transformedPos.z * 0.5);
        transformedPos.xy *= perspective;
        transformedPos.z = position.z;

        vTexUv = uv * perspective;
        vFragPerspective = perspective;     

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformedPos, 1.0);

      }
    `,

    fragmentShader: /* glsl */ `   

      uniform sampler2D _mainTex;
      uniform vec4 _mainTint;
      uniform float _time; 

      uniform float _fps;
      uniform float _cols;
      uniform float _rows;
      uniform float _totalFrames;

      varying vec2 vUv; 
      varying vec2 vTexUv;
      varying float vFragPerspective;

      vec2 spriteAnimation(vec2 uv, float time, float fps, float cols, float rows, float totalFrames) {
        
        float frame = floor(mod(time * fps, totalFrames));        
        float col = mod(frame, cols);
        float row = floor(frame / cols);       
        vec2 cellSize = vec2(1.0 / cols, 1.0 / rows);       
        uv = uv * cellSize + vec2(col, (rows - 1.0 - row)) * cellSize;

        return uv;
      }


      void main() {       

        vec2 uv = vUv;     
        vec2 transformedUv = vTexUv / vFragPerspective;
        transformedUv = spriteAnimation(transformedUv, _time, _fps, _cols, _rows, _totalFrames);
        vec4 texColor = texture2D(_mainTex, transformedUv);
        
        gl_FragColor = texColor;
      
      }
  `,

};

export { SpriteOrientShader }
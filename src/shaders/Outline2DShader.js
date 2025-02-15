
const Outline2DShader = {

    vertexShader: /* glsl */ `

        varying vec2 vUv;
        varying vec4 vClipSpacePosition;
   
        void main() {

            vUv = uv;     
            vClipSpacePosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_Position = vClipSpacePosition;

        }
    `,

    fragmentShader: /* glsl */ `   

    uniform sampler2D _spriteTex;
    uniform float _outlineThickness;
    uniform vec3 _outlineColor;
    uniform float _outlineOpacity;
    uniform int _ringCount;
    uniform vec2 _offset;
    uniform bool _squareBorder;
    uniform bool _isSecondPass;    

    varying vec2 vUv;   
    varying vec4 vClipSpacePosition;
    
    vec2 square(float i){ // samples a square pattern
        i *= 2.0;
        return (vec2(
            clamp(abs(mod(i,2.0)-1.0),0.25,0.75),
            clamp(abs(mod(i+0.5,2.0)-1.0),0.25,0.75)
            )-0.5)*4.0;
    }

    vec4 tex(sampler2D sampler, vec2 uv){
        vec4 clr;
        if (uv.x > 0.0 && uv.y > 0.0 && uv.x < 1.0 && uv.y < 1.0){ // bleeding texture sampling fix
            clr = texture(sampler, uv);
        }else{clr = vec4(0.0);}
        return clr;
    }

    void main() {      
        
        //Outline Params
        float ringOffset = 0.0;
        float aspectRatio = 1.0;
        vec2 offsetSize = _offset / vec2(textureSize(_spriteTex, 0));

        vec2 uv = vUv;
        //if second pass, change the uv to screen uv
        if(_isSecondPass){
            vec3 ndc = vClipSpacePosition.xyz / vClipSpacePosition.w;           
            uv = (ndc.xy + 1.0) / 2.0;
        }

        vec2 ticknessSize = vec2(_outlineThickness) / vec2(textureSize(_spriteTex, 0));

        vec4 spriteColor = tex(_spriteTex, uv);

        float alpha = spriteColor.a;
        if (_squareBorder){ // square border is useful for pixel sprites
            for(int i=0; i<_ringCount; ++i){
                float r = float(i) / float(_ringCount) + ringOffset;
                alpha = max(alpha, texture(_spriteTex, uv + offsetSize + ticknessSize * square(r) * vec2(aspectRatio,1.0)).a * _outlineOpacity); // texture sampling fix is disabled because both with and without give the same result
            }
        }else{
            for(int i=0; i<_ringCount; ++i){
                float r = float(i) * 3.14159 / float(_ringCount) * 2.0 + ringOffset;               
                alpha = max(alpha, tex(_spriteTex, uv + offsetSize +  vec2(ticknessSize.x * sin(r) * aspectRatio, ticknessSize.y * cos(r))).a * _outlineOpacity);
            }
        }
        
        vec4 finalColor = vec4(mix(_outlineColor, spriteColor.rgb, spriteColor.a), clamp(alpha, 0.0, 1.0));
      
        gl_FragColor = finalColor;
     
    }
  `,

};

export { Outline2DShader  }
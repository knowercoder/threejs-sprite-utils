import{T as g,f as p,S as u,C as x,P as _,W as h,d as w,R as z,a as S,V as y,g as A,D as P,c as l,h as T,i as F}from"./three.module-dwYFqkzA.js";import{G as U}from"./dat.gui.module-DYGKXP-V.js";const s={vertexShader:`

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
    `,fragmentShader:`   

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
  `},t=document.querySelector("canvas.webgl"),c=new g,d=c.load("./assets/Space-Background-Image.jpg");d.colorSpace=p;const R=c.load("./assets/Home1.png"),r=new u;r.background=new x(8026746);const e={width:t.clientWidth,height:t.clientHeight},a=new _(75,e.width/e.height,.1,100);a.position.set(0,0,2);r.add(a);const o=new h({canvas:t,antialias:!0,alpha:!0});o.setSize(e.width,e.height);o.setPixelRatio(window.devicePixelRatio);new w(e.width,e.height,{format:z,transparent:!0,premultipliedAlpha:!1});const i=new S({uniforms:{_mainTex:{value:R},_mainTint:{value:new y(1,1,1,1)},_orientation:{value:new A(0,0,0)},_time:{value:0},_fps:{value:12},_cols:{value:1},_rows:{value:1},_totalFrames:{value:1}},vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,transparent:!0,side:P}),v=new l(new T({map:d}));v.scale.set(3.5,3.5,1);const m=new l(i);m.scale.set(2,2,1);r.add(v);r.add(m);window.addEventListener("resize",()=>{e.width=t.clientWidth,e.height=t.clientHeight,a.aspect=e.width/e.height,a.updateProjectionMatrix(),o.setSize(e.width,e.height),o.setPixelRatio(window.devicePixelRatio)});const C=new U,n=C.addFolder("Orientation");n.add(i.uniforms._orientation.value,"x",-360,360,.1).name("X");n.add(i.uniforms._orientation.value,"y",-360,360,.1).name("Y");n.add(i.uniforms._orientation.value,"z",-360,360,.1).name("Z");n.open();let M=new F;function f(){requestAnimationFrame(f),i.uniforms._time.value=M.getElapsedTime(),o.render(r,a)}f();

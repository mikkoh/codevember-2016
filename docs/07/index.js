(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const getChevron = require('geo-chevron');
const mat4 = require('gl-mat4');
const vec3 = require('gl-vec3');
const primitiveJoin = require('./primitive-join');

const allGeo = {};
const translate = mat4.create();

for(var i = 0; i < 10; i++) {
  let chevron = getChevron({
    width: 2,
    depth: 2,
    thickness: 1
  });

  mat4.translate(translate, translate, [1.5, 0, 0]);
  chevron.positions.forEach((position) => {
    vec3.transformMat4(position, position, translate);
  });

  primitiveJoin(allGeo, chevron);
}


module.exports = allGeo;
},{"./primitive-join":72,"geo-chevron":10,"gl-mat4":21,"gl-vec3":47}],2:[function(require,module,exports){
const getPieceRing = require('geo-piecering');
const primitiveJoin = require('./primitive-join');

const pieceRing = {};

primitiveJoin(pieceRing, getPieceRing({
  radius: 7,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.6
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 8,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 1,
  y: -2,
  startRadian: Math.PI * 0.1
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 10,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 2,
  y: -4,
  startRadian: Math.PI * 0.1
}));

module.exports = pieceRing;
},{"./primitive-join":72,"geo-piecering":11}],3:[function(require,module,exports){
const getPieceRing = require('geo-piecering');
const primitiveJoin = require('./primitive-join');

const pieceRing = {};

primitiveJoin(pieceRing, getPieceRing({
  radius: 7,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.6,
  y: 20
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 8,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 0.2,
  y: 18,
  startRadian: Math.PI * 0.1
}));

primitiveJoin(pieceRing, getPieceRing({
  radius: 10,
  pieceSize: Math.PI * 0.3,
  numPieces: 5,
  height: 2,
  y: 16,
  startRadian: Math.PI * 0.1
}));

for(var i = 0; i < 40; i++) {
  primitiveJoin(pieceRing, getPieceRing({
    radius: Math.random() * 20,
    pieceSize: Math.PI * 0.02,
    numPieces: 10,
    height: 0.3,
    y: -20 + i * 0.4,
    startRadian: Math.random()
  }));
}

module.exports = pieceRing;
},{"./primitive-join":72,"geo-piecering":11}],4:[function(require,module,exports){
const mat4 = require('gl-mat4');
const getPost1 = require('./get-post1');
const getPost2 = require('./get-post2');
const getLightDrawing = require('./get-light-drawing');
const geoPieceRingStack = require('./geo-piece-ring-stack');
const geoTopPieceRings = require('./geo-top-piece-rings');
const geoChevronList = require('./geo-chevron-list');

module.exports = (regl) => {
  const drawPost1 = getPost1(regl);
  const drawPost2 = getPost2(regl);
  const drawPieceRings = getLightDrawing(regl, geoPieceRingStack);
  const drawPieceRingsTop = getLightDrawing(regl, geoTopPieceRings);
  const drawChevrons = getLightDrawing(regl, geoChevronList);

  return ({time}, props) => {
    const parent = mat4.create();
    const modelSides = mat4.create();
    const modelMiddle = mat4.create();

    // update parent
    mat4.rotateY(parent, parent, time);

    mat4.rotateX(modelSides, modelSides, Math.PI * 0.5);
    mat4.translate(modelSides, modelSides, [-10, -10, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [20, 0, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [0, 20, 0]);
    drawPost1({
      parent,
      model: modelSides
    });

    mat4.translate(modelSides, modelSides, [-20, 0, 0]);
    drawPost1({
      parent,
      model: modelSides
    });


    // draw the middle post
    mat4.translate(modelMiddle, modelMiddle, [0, -25, 0]);

    drawPost2({
      parent,
      model: modelMiddle
    });

    drawPieceRings({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, 11, 0]);

    drawPost2({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, -5, 0]);
    drawPieceRings({
      parent,
      model: modelMiddle
    });

    mat4.translate(modelMiddle, modelMiddle, [0, 10.5 + (Math.sin(time) + 1) * 0.5 * 3, 0]);
    mat4.rotateY(modelMiddle, modelMiddle, time);
    mat4.rotateZ(modelMiddle, modelMiddle, Math.PI * 0.5);
    drawChevrons({
      parent,
      model: modelMiddle
    });


    drawPieceRingsTop({
      parent,
      model: mat4.create()
    });
  };
};

},{"./geo-chevron-list":1,"./geo-piece-ring-stack":2,"./geo-top-piece-rings":3,"./get-light-drawing":5,"./get-post1":6,"./get-post2":7,"gl-mat4":21}],5:[function(require,module,exports){

const gl = require('glslify');
const mat4 = require('gl-mat4');

module.exports = (regl, attributes) => {
  const frag = gl(["\n    precision mediump float;\n#define GLSLIFY 1\n\n\n    //\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n    void main() {\n      vec3 outColor = vec3(gl_FragCoord.y / 1000.0, 1.0 - gl_FragCoord.y / 1000.0, 0.0);\n\n      outColor *= snoise(gl_FragCoord.xy / 1000.0 * 10.0) * 0.2 + 0.8;\n\n      gl_FragColor = vec4(outColor, 0.5);\n    }\n  "]);

  const vert = `
    attribute vec3 positions;

    uniform mat4 projection;
    uniform mat4 viewModel;

    void main() {
      gl_Position = projection * viewModel * vec4(positions, 1.0);
    }
  `;

  return regl({
    frag,
    vert,
    attributes: attributes,
    elements: attributes.cells,
    count: attributes.cells.length * 3,
    uniforms: {
      color: [0.106, 0.071, 0.004],
      model: regl.prop('model'),
      parent: regl.prop('parent'),
      viewModel: ({view}, {parent, model}) => {
        const parentModel = mat4.create();
        const viewModel = mat4.create();
        
        mat4.multiply(parentModel, parent, model);
        mat4.multiply(viewModel, view, parentModel);
        
        return viewModel;
      }
    },
    blend: {
      enable: true,
      func: { src:'src alpha', dst:'one' }
    }
  })
};

},{"gl-mat4":21,"glslify":69}],6:[function(require,module,exports){
const getCube = require('primitive-cube');
const gl = require('glslify');
const mat4 = require('gl-mat4');

const cube = getCube(4, 4, 50);

module.exports = (regl) => {
  const frag = gl(["\n    precision mediump float;\n#define GLSLIFY 1\n\n\n    #define PI 3.141592653589793\n\n    float blinnPhongSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n\n  //Calculate Blinn-Phong power\n  vec3 H = normalize(viewDirection + lightDirection);\n  return pow(max(0.0, dot(surfaceNormal, H)), shininess);\n}\n\n    //\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n    uniform vec3 color;\n\n    varying vec2 vUV;\n    varying vec3 vNormal;\n    varying vec3 vOriginalNormal;\n\n    vec3 rotateX(vec3 vec, float rad) {\n      mat3 rotation = mat3(\n        1, 0, 0, \n        0, cos(rad), -sin(rad), \n        0, sin(rad), cos(rad)\n      );\n\n      return rotation * vec;\n    }\n\n    vec3 rotateY(vec3 vec, float rad) {\n      mat3 rotation = mat3(\n        cos(rad), 0, sin(rad), \n        0, 1, 0, \n        -sin(rad), 0, cos(rad)\n      );\n\n      return rotation * vec;\n    }\n\n    void main() {\n      vec3 normal = vNormal;\n      vec3 lightDirection1 = vec3(0, 0.5, 0.5);\n      vec3 lightDirection2 = vec3(0, -1, 0);\n      vec3 eyeDirection = vec3(0, 0, 1);\n      float shininess = 3.0;\n\n      bool isSide = vOriginalNormal.x > 0.0 || vOriginalNormal.x < 0.0 || vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0;\n\n      if(isSide) {\n        float lineSize = 0.02;\n        float lineRotation = 0.0;\n\n        // because the sides are layed out differently with uvs we need to do this\n        if(vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0) {  \n          lineRotation += -(step(0.3, vUV.x) - step(0.3 + lineSize, vUV.x));\n          lineRotation += step(0.3 - lineSize, vUV.x) - step(0.3, vUV.x);\n\n          lineRotation += -(step(0.7, vUV.x) - step(0.7 + lineSize, vUV.x));\n          lineRotation += step(0.7 - lineSize, vUV.x) - step(0.7, vUV.x);\n\n          // bound it\n          lineRotation *= step(0.05, vUV.y);\n          lineRotation *= step(vUV.y, 0.95);\n        } else {\n          lineRotation += -(step(0.3, vUV.y) - step(0.3 + lineSize, vUV.y));\n          lineRotation += step(0.3 - lineSize, vUV.y) - step(0.3, vUV.y);\n\n          lineRotation += -(step(0.5, vUV.y) - step(0.5 + lineSize, vUV.y));\n          lineRotation += step(0.5 - lineSize, vUV.y) - step(0.5, vUV.y);\n\n          lineRotation += -(step(0.7, vUV.y) - step(0.7 + lineSize, vUV.y));\n          lineRotation += step(0.7 - lineSize, vUV.y) - step(0.7, vUV.y);\n\n          // bound it\n          lineRotation *= step(0.1, vUV.x);\n          lineRotation *= step(vUV.x, 0.9);\n        }\n\n        // this will give some noise to the surface\n        lineRotation += snoise(vUV * 100.0) * 0.05 - 0.025;\n\n        // rotate it to get the line\n        normal = rotateX(normal, lineRotation * PI * -0.5);\n      }\n\n      float power1 = blinnPhongSpecular(lightDirection1, eyeDirection, normal, shininess);\n      float power2 = blinnPhongSpecular(lightDirection2, eyeDirection, normal, shininess);\n\n      vec3 outColor = vec3(0.0);\n\n      outColor += vec3(0.271, 0.200, 0.027) * power1;\n      outColor += vec3(0.600, 0.788, 0.804) * power2;\n      outColor += color  * power1;\n      outColor *= 0.4;\n\n      gl_FragColor = vec4(outColor, 1.0);\n    }\n  "]);

  const vert = `
    attribute vec3 positions;
    attribute vec2 uvs;
    attribute vec3 normals;

    uniform mat4 projection;
    uniform mat4 viewModel;
    uniform mat4 normalMatrix;

    varying vec2 vUV;
    varying vec3 vNormal;
    varying vec3 vOriginalNormal;

    void main() {
      gl_Position = projection * viewModel * vec4(positions, 1.0);
      vUV = uvs;
      vNormal = (normalMatrix * vec4(normals, 1.0)).xyz;
      vOriginalNormal = normals;
    }
  `;

  function getViewModel(view, model, parent) {
    const parentModel = mat4.create();
    const viewModel = mat4.create();
    
    mat4.multiply(parentModel, parent, model);  
    mat4.multiply(viewModel, view, parentModel);

    return viewModel;
  }

  return regl({
    frag,
    vert,
    attributes: cube,
    elements: cube.cells,
    count: cube.cells.length * 3,
    uniforms: {
      model: regl.prop('model'),
      color: [0.788, 0.902, 0.933],
      parent: (context, {parent = mat4.create()}) => {
        return parent;
      },
      viewModel: ({view}, {parent, model}) => {
        return getViewModel(view, model, parent);
      },
      normalMatrix: ({view}, {parent, model}) => {
        const normalMatrix = getViewModel(view, model, parent);

        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        return normalMatrix;
      }
    }
  })
};

},{"gl-mat4":21,"glslify":69,"primitive-cube":70}],7:[function(require,module,exports){
const getCube = require('primitive-cube');
const gl = require('glslify');
const mat4 = require('gl-mat4');

const cube = getCube(6, 10, 6);

module.exports = (regl) => {
  const frag = gl(["\n    precision mediump float;\n#define GLSLIFY 1\n\n\n    #define PI 3.141592653589793\n\n    float blinnPhongSpecular(\n  vec3 lightDirection,\n  vec3 viewDirection,\n  vec3 surfaceNormal,\n  float shininess) {\n\n  //Calculate Blinn-Phong power\n  vec3 H = normalize(viewDirection + lightDirection);\n  return pow(max(0.0, dot(surfaceNormal, H)), shininess);\n}\n\n    //\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec3 permute(vec3 x) {\n  return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat snoise(vec2 v)\n  {\n  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0\n                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)\n                     -0.577350269189626,  // -1.0 + 2.0 * C.x\n                      0.024390243902439); // 1.0 / 41.0\n// First corner\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n\n// Other corners\n  vec2 i1;\n  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0\n  //i1.y = 1.0 - i1.x;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  // x0 = x0 - 0.0 + 0.0 * C.xx ;\n  // x1 = x0 - i1 + 1.0 * C.xx ;\n  // x2 = x0 - 1.0 + 2.0 * C.xx ;\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n\n// Permutations\n  i = mod289(i); // Avoid truncation effects in permutation\n  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))\n    + i.x + vec3(0.0, i1.x, 1.0 ));\n\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\n  m = m*m ;\n  m = m*m ;\n\n// Gradients: 41 points uniformly over a line, mapped onto a diamond.\n// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)\n\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n\n// Normalise gradients implicitly by scaling m\n// Approximation of: m *= inversesqrt( a0*a0 + h*h );\n  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );\n\n// Compute final noise value at P\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\n    uniform vec3 color;\n\n    varying vec2 vUV;\n    varying vec3 vNormal;\n    varying vec3 vOriginalNormal;\n\n    vec3 rotateX(vec3 vec, float rad) {\n      mat3 rotation = mat3(\n        1, 0, 0, \n        0, cos(rad), -sin(rad), \n        0, sin(rad), cos(rad)\n      );\n\n      return rotation * vec;\n    }\n\n    vec3 rotateY(vec3 vec, float rad) {\n      mat3 rotation = mat3(\n        cos(rad), 0, sin(rad), \n        0, 1, 0, \n        -sin(rad), 0, cos(rad)\n      );\n\n      return rotation * vec;\n    }\n\n    void main() {\n      vec3 normal = vNormal;\n      vec3 lightDirection1 = vec3(0, 0.5, 0.5);\n      vec3 lightDirection2 = vec3(0, -1, 0);\n      vec3 eyeDirection = vec3(0, 0, 1);\n      float shininess = 3.0;\n\n      bool isSide = vOriginalNormal.x > 0.0 || vOriginalNormal.x < 0.0 || vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0;\n\n      if(isSide) {\n        float lineSize = 0.03;\n        float lineRotation = 0.0;\n\n        // because the sides are layed out differently with uvs we need to do this\n        if(vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0) {  \n          lineRotation += -(step(0.3, vUV.x) - step(0.3 + lineSize, vUV.x));\n          lineRotation += step(0.3 - lineSize, vUV.x) - step(0.3, vUV.x);\n\n          lineRotation += -(step(0.5, vUV.x) - step(0.5 + lineSize, vUV.x));\n          lineRotation += step(0.5 - lineSize, vUV.x) - step(0.5, vUV.x);\n\n          lineRotation += -(step(0.7, vUV.x) - step(0.7 + lineSize, vUV.x));\n          lineRotation += step(0.7 - lineSize, vUV.x) - step(0.7, vUV.x);\n\n          // bound it\n          lineRotation *= step(0.05, vUV.y);\n          lineRotation *= step(vUV.y, 0.95);\n        } else {\n          vec2 uvScaled = mod(vUV, 0.2) / 0.2;\n\n          lineRotation += -(step(0.4, uvScaled.y) - step(0.4 + lineSize, uvScaled.y));\n          lineRotation += step(0.4 - lineSize, uvScaled.y) - step(0.4, uvScaled.y);\n\n          // bound it\n          lineRotation *= step(0.3, vUV.x);\n          lineRotation *= step(vUV.x, 0.7);\n        }\n\n        // this will give some noise to the surface\n        lineRotation += snoise(vUV * 100.0) * 0.05 - 0.025;\n\n        // rotate it to get the line\n        normal = rotateX(normal, lineRotation * PI * -0.5);\n      }\n\n      float power1 = blinnPhongSpecular(lightDirection1, eyeDirection, normal, shininess);\n      float power2 = blinnPhongSpecular(lightDirection2, eyeDirection, normal, shininess);\n\n      vec3 outColor = vec3(0.0);\n\n      outColor += color  * power1;\n\n      gl_FragColor = vec4(outColor, 1.0);\n    }\n  "]);

  const vert = `
    attribute vec3 positions;
    attribute vec2 uvs;
    attribute vec3 normals;

    uniform mat4 projection;
    uniform mat4 viewModel;
    uniform mat4 normalMatrix;

    varying vec2 vUV;
    varying vec3 vNormal;
    varying vec3 vOriginalNormal;

    void main() {
      gl_Position = projection * viewModel * vec4(positions, 1.0);
      vUV = uvs;
      vNormal = (normalMatrix * vec4(normals, 1.0)).xyz;
      vOriginalNormal = normals;
    }
  `;

  function getViewModel(view, model, parent) {
    const parentModel = mat4.create();
    const viewModel = mat4.create();
    
    mat4.multiply(parentModel, parent, model);
    mat4.multiply(viewModel, view, parentModel);
    

    return viewModel;
  }

  return regl({
    frag,
    vert,
    attributes: cube,
    elements: cube.cells,
    count: cube.cells.length * 3,
    uniforms: {
      model: regl.prop('model'),
      color: [0.3, 0.3, 0.3],
      parent: (context, {parent = mat4.create()}) => {
        return parent;
      },
      viewModel: ({view}, {parent, model}) => {
        return getViewModel(view, model, parent);
      },
      normalMatrix: ({view}, {parent, model}) => {
        const normalMatrix = getViewModel(view, model, parent);

        mat4.invert(normalMatrix, normalMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        return normalMatrix;
      }
    }
  })
};

},{"gl-mat4":21,"glslify":69,"primitive-cube":70}],8:[function(require,module,exports){
const mat4 = require('gl-mat4');

module.exports = (regl) => {
  return regl({
    context: {
      projection: function (context) {
        return mat4.perspective(
          [],
          Math.PI / 4,
          context.viewportWidth / context.viewportHeight,
          0.01,
          1000.0
        );
      },

      view: function () {
        const view = mat4.create();

        mat4.translate(view, view, [0, 0, -100]);

        return view;
      }
    },

    uniforms: {
      projection: regl.context('projection'),
      view: regl.context('view')
    }
  });
};

},{"gl-mat4":21}],9:[function(require,module,exports){
const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getBuilding = require('./get-building');

const setupScene = getSetupScene(regl);
const drawBuilding = getBuilding(regl);

regl.frame(() => {
  setupScene((context, props) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    drawBuilding(context, props);
  });
});

},{"./get-building":4,"./get-setup-scene":8,"regl":71}],10:[function(require,module,exports){
module.exports = geoChevron;

function geoChevron( options ) {

  var geo = {
    positions: [],
    cells: []
  };

  options = options || {};
  options.cellSize = options.cellSize || 3;
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.z = options.z || 0;
  options.width = options.width || 100;
  options.depth = options.depth || 50;
  options.thickness = options.thickness || 20;

  createGeometry( options, geo.positions, geo.cells );

  return geo;
}

function createGeometry( options, positions, cells ) {

  var o = options;
  var halfWidth = o.width * 0.5;
  var halfDepth = o.depth * 0.5;
  var y = o.y;
  var tlX = -halfDepth + o.x;
  var tlZ = -halfWidth + o.z;
  var tliX = tlX + o.thickness + o.x; //inner
  var tliZ = tlZ + o.z; //inner
  var blX = tlX;
  var blZ = halfWidth;
  var bliX = tliX; //inner
  var bliZ = blZ; //inner
  var tipX = halfDepth;
  var tipZ = 0;
  var tipiX = halfDepth - o.thickness; //inner
  var tipiZ = 0; //inner
  var idxTL = 0;
  var idxTLI = 1;
  var idxTIPI = 2;
  var idxBLI = 3;
  var idxBL = 4;
  var idxTIP = 5;

  positions.push( [ tlX, y, tlZ ] );
  positions.push( [ tliX, y, tliZ ] );
  positions.push( [ tipiX, y, tipiZ ] );
  positions.push( [ bliX, y, bliZ ] );
  positions.push( [ blX, y, blZ ] );
  positions.push( [ tipX, y, tipZ ] );

  if( o.cellSize == 1 ) {

    cells.push( [ idxTL ],
                [ idxTLI ],
                [ idxTIPI ],
                [ idxBLI ],
                [ idxBL ],
                [ idxTIP ] );
  } else if( o.cellSize == 2 ) {

    cells.push( [ idxTL, idxTLI ],
                [ idxTLI, idxTIP ],
                [ idxTIP, idxBLI ],
                [ idxBLI, idxBL ],
                [ idxBL, idxTIPI ],
                [ idxTIPI, idxTL ] );
  } else if( o.cellSize == 3 ) {

    cells.push( [ idxTL, idxTLI, idxTIP ],
                [ idxTL, idxTIPI, idxTIP ],

                [ idxBL, idxBLI, idxTIP ],
                [ idxBL, idxTIPI, idxTIP ] );
  }
  
}
},{}],11:[function(require,module,exports){
module.exports = geoPieceRing;

function geoPieceRing(options) {

  var geo = {
    positions: [],
    cells: []
  };

  options = options || {};
  options.cellSize = options.cellSize || 3;
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.z = options.z || 0;
  options.radius = options.radius || 200;
  options.pieceSize = options.pieceSize || Math.PI * 0.15;
  options.startRadian = options.startRadian || 0;
  options.numPieces = options.numPieces || 8;
  options.quadsPerPiece = options.quadsPerPiece || 5;
  options.height = options.height || 10;
  options.drawOutline = options.drawOutline === undefined ? true : options.drawOutline;
  
  createGeometry(options, geo.positions, geo.cells);

  return geo;
}

function createGeometry(options, positions, cells) {

  var o = options;
  var pos = positions;
  var y = o.y;
  var halfHeight = o.height * 0.5;
  var radius = o.radius;
  var pieceSize = o.pieceSize;
  var numPieces = o.numPieces;
  var quadsPP = o.quadsPerPiece;
  var startRadian = o.startRadian;
  var radInc = (2 * Math.PI - ( numPieces * pieceSize )) / numPieces;
  var quadRadInc = pieceSize / quadsPP;
  var curRad = 0; 
  var sIdx = 0;
  var x, z, x2, z2, r1, r2;

  for(var i = 0; i < numPieces; i++) {

    for(var j = 0; j < quadsPP; j++) {

      r1 = curRad + quadRadInc * j + startRadian;
      r2 = curRad + quadRadInc * (j + 1) + startRadian;

      x = Math.cos(r1) * radius + o.x;
      z = Math.sin(r1) * radius + o.z;
      x2 = Math.cos(r2) * radius + o.x;
      z2 = Math.sin(r2) * radius + o.z;

      pos.push([ x, y - halfHeight, z ]);
      pos.push([ x, y + halfHeight, z ]);
      pos.push([ x2, y + halfHeight, z2 ]);
      pos.push([ x2, y - halfHeight, z2 ]);
      
      //add in the cells
      if(o.cellSize == 1) {

        cells.push([ sIdx ]);
        cells.push([ sIdx + 1 ]);
        cells.push([ sIdx + 2 ]);
        cells.push([ sIdx + 3 ]);
      } else if(o.cellSize == 2) {

        // vertical lines
        if( !o.drawOutline ) {

          cells.push([ sIdx, sIdx + 1 ]);
          cells.push([ sIdx + 2, sIdx + 3 ]);
        } else if( j === 0 ) {

          cells.push([ sIdx, sIdx + 1 ]);
        } else if( j == quadsPP - 1 ) {

          cells.push([ sIdx + 2, sIdx + 3 ]);
        }
        
        // horizontal lines
        cells.push([ sIdx + 1, sIdx + 2 ]);
        cells.push([ sIdx + 3, sIdx ]);
      } else if(o.cellSize == 3) {

        cells.push([ sIdx, sIdx + 1, sIdx + 2 ]);
        cells.push([ sIdx + 3, sIdx, sIdx + 2 ]);
      }

      sIdx += 4;
    }

    curRad += radInc + pieceSize;
  }
}
},{}],12:[function(require,module,exports){
module.exports = adjoint;

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};
},{}],13:[function(require,module,exports){
module.exports = clone;

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],14:[function(require,module,exports){
module.exports = copy;

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],15:[function(require,module,exports){
module.exports = create;

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],16:[function(require,module,exports){
module.exports = determinant;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};
},{}],17:[function(require,module,exports){
module.exports = fromQuat;

/**
 * Creates a matrix from a quaternion rotation.
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @returns {mat4} out
 */
function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};
},{}],18:[function(require,module,exports){
module.exports = fromRotationTranslation;

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};
},{}],19:[function(require,module,exports){
module.exports = frustum;

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};
},{}],20:[function(require,module,exports){
module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};
},{}],21:[function(require,module,exports){
module.exports = {
  create: require('./create')
  , clone: require('./clone')
  , copy: require('./copy')
  , identity: require('./identity')
  , transpose: require('./transpose')
  , invert: require('./invert')
  , adjoint: require('./adjoint')
  , determinant: require('./determinant')
  , multiply: require('./multiply')
  , translate: require('./translate')
  , scale: require('./scale')
  , rotate: require('./rotate')
  , rotateX: require('./rotateX')
  , rotateY: require('./rotateY')
  , rotateZ: require('./rotateZ')
  , fromRotationTranslation: require('./fromRotationTranslation')
  , fromQuat: require('./fromQuat')
  , frustum: require('./frustum')
  , perspective: require('./perspective')
  , perspectiveFromFieldOfView: require('./perspectiveFromFieldOfView')
  , ortho: require('./ortho')
  , lookAt: require('./lookAt')
  , str: require('./str')
}
},{"./adjoint":12,"./clone":13,"./copy":14,"./create":15,"./determinant":16,"./fromQuat":17,"./fromRotationTranslation":18,"./frustum":19,"./identity":20,"./invert":22,"./lookAt":23,"./multiply":24,"./ortho":25,"./perspective":26,"./perspectiveFromFieldOfView":27,"./rotate":28,"./rotateX":29,"./rotateY":30,"./rotateZ":31,"./scale":32,"./str":33,"./translate":34,"./transpose":35}],22:[function(require,module,exports){
module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};
},{}],23:[function(require,module,exports){
var identity = require('./identity');

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};
},{"./identity":20}],24:[function(require,module,exports){
module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};
},{}],25:[function(require,module,exports){
module.exports = ortho;

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};
},{}],26:[function(require,module,exports){
module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
},{}],27:[function(require,module,exports){
module.exports = perspectiveFromFieldOfView;

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}


},{}],28:[function(require,module,exports){
module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};
},{}],29:[function(require,module,exports){
module.exports = rotateX;

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};
},{}],30:[function(require,module,exports){
module.exports = rotateY;

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};
},{}],31:[function(require,module,exports){
module.exports = rotateZ;

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};
},{}],32:[function(require,module,exports){
module.exports = scale;

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};
},{}],33:[function(require,module,exports){
module.exports = str;

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};
},{}],34:[function(require,module,exports){
module.exports = translate;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};
},{}],35:[function(require,module,exports){
module.exports = transpose;

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};
},{}],36:[function(require,module,exports){
module.exports = add;

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
    out[0] = a[0] + b[0]
    out[1] = a[1] + b[1]
    out[2] = a[2] + b[2]
    return out
}
},{}],37:[function(require,module,exports){
module.exports = angle

var fromValues = require('./fromValues')
var normalize = require('./normalize')
var dot = require('./dot')

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
    var tempA = fromValues(a[0], a[1], a[2])
    var tempB = fromValues(b[0], b[1], b[2])
 
    normalize(tempA, tempA)
    normalize(tempB, tempB)
 
    var cosine = dot(tempA, tempB)

    if(cosine > 1.0){
        return 0
    } else {
        return Math.acos(cosine)
    }     
}

},{"./dot":44,"./fromValues":46,"./normalize":55}],38:[function(require,module,exports){
module.exports = clone;

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
    var out = new Float32Array(3)
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
}
},{}],39:[function(require,module,exports){
module.exports = copy;

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
    out[0] = a[0]
    out[1] = a[1]
    out[2] = a[2]
    return out
}
},{}],40:[function(require,module,exports){
module.exports = create;

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
    var out = new Float32Array(3)
    out[0] = 0
    out[1] = 0
    out[2] = 0
    return out
}
},{}],41:[function(require,module,exports){
module.exports = cross;

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2]

    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out
}
},{}],42:[function(require,module,exports){
module.exports = distance;

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2]
    return Math.sqrt(x*x + y*y + z*z)
}
},{}],43:[function(require,module,exports){
module.exports = divide;

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
    out[0] = a[0] / b[0]
    out[1] = a[1] / b[1]
    out[2] = a[2] / b[2]
    return out
}
},{}],44:[function(require,module,exports){
module.exports = dot;

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}
},{}],45:[function(require,module,exports){
module.exports = forEach;

var vec = require('./create')()

/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
function forEach(a, stride, offset, count, fn, arg) {
        var i, l
        if(!stride) {
            stride = 3
        }

        if(!offset) {
            offset = 0
        }
        
        if(count) {
            l = Math.min((count * stride) + offset, a.length)
        } else {
            l = a.length
        }

        for(i = offset; i < l; i += stride) {
            vec[0] = a[i] 
            vec[1] = a[i+1] 
            vec[2] = a[i+2]
            fn(vec, vec, arg)
            a[i] = vec[0] 
            a[i+1] = vec[1] 
            a[i+2] = vec[2]
        }
        
        return a
}
},{"./create":40}],46:[function(require,module,exports){
module.exports = fromValues;

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
    var out = new Float32Array(3)
    out[0] = x
    out[1] = y
    out[2] = z
    return out
}
},{}],47:[function(require,module,exports){
module.exports = {
  create: require('./create')
  , clone: require('./clone')
  , angle: require('./angle')
  , fromValues: require('./fromValues')
  , copy: require('./copy')
  , set: require('./set')
  , add: require('./add')
  , subtract: require('./subtract')
  , multiply: require('./multiply')
  , divide: require('./divide')
  , min: require('./min')
  , max: require('./max')
  , scale: require('./scale')
  , scaleAndAdd: require('./scaleAndAdd')
  , distance: require('./distance')
  , squaredDistance: require('./squaredDistance')
  , length: require('./length')
  , squaredLength: require('./squaredLength')
  , negate: require('./negate')
  , inverse: require('./inverse')
  , normalize: require('./normalize')
  , dot: require('./dot')
  , cross: require('./cross')
  , lerp: require('./lerp')
  , random: require('./random')
  , transformMat4: require('./transformMat4')
  , transformMat3: require('./transformMat3')
  , transformQuat: require('./transformQuat')
  , rotateX: require('./rotateX')
  , rotateY: require('./rotateY')
  , rotateZ: require('./rotateZ')
  , forEach: require('./forEach')
}
},{"./add":36,"./angle":37,"./clone":38,"./copy":39,"./create":40,"./cross":41,"./distance":42,"./divide":43,"./dot":44,"./forEach":45,"./fromValues":46,"./inverse":48,"./length":49,"./lerp":50,"./max":51,"./min":52,"./multiply":53,"./negate":54,"./normalize":55,"./random":56,"./rotateX":57,"./rotateY":58,"./rotateZ":59,"./scale":60,"./scaleAndAdd":61,"./set":62,"./squaredDistance":63,"./squaredLength":64,"./subtract":65,"./transformMat3":66,"./transformMat4":67,"./transformQuat":68}],48:[function(require,module,exports){
module.exports = inverse;

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0]
  out[1] = 1.0 / a[1]
  out[2] = 1.0 / a[2]
  return out
}
},{}],49:[function(require,module,exports){
module.exports = length;

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    return Math.sqrt(x*x + y*y + z*z)
}
},{}],50:[function(require,module,exports){
module.exports = lerp;

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
    var ax = a[0],
        ay = a[1],
        az = a[2]
    out[0] = ax + t * (b[0] - ax)
    out[1] = ay + t * (b[1] - ay)
    out[2] = az + t * (b[2] - az)
    return out
}
},{}],51:[function(require,module,exports){
module.exports = max;

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
    out[0] = Math.max(a[0], b[0])
    out[1] = Math.max(a[1], b[1])
    out[2] = Math.max(a[2], b[2])
    return out
}
},{}],52:[function(require,module,exports){
module.exports = min;

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
    out[0] = Math.min(a[0], b[0])
    out[1] = Math.min(a[1], b[1])
    out[2] = Math.min(a[2], b[2])
    return out
}
},{}],53:[function(require,module,exports){
module.exports = multiply;

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
    out[0] = a[0] * b[0]
    out[1] = a[1] * b[1]
    out[2] = a[2] * b[2]
    return out
}
},{}],54:[function(require,module,exports){
module.exports = negate;

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
    out[0] = -a[0]
    out[1] = -a[1]
    out[2] = -a[2]
    return out
}
},{}],55:[function(require,module,exports){
module.exports = normalize;

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    var len = x*x + y*y + z*z
    if (len > 0) {
        //TODO: evaluate use of glm_invsqrt here?
        len = 1 / Math.sqrt(len)
        out[0] = a[0] * len
        out[1] = a[1] * len
        out[2] = a[2] * len
    }
    return out
}
},{}],56:[function(require,module,exports){
module.exports = random;

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
    scale = scale || 1.0

    var r = Math.random() * 2.0 * Math.PI
    var z = (Math.random() * 2.0) - 1.0
    var zScale = Math.sqrt(1.0-z*z) * scale

    out[0] = Math.cos(r) * zScale
    out[1] = Math.sin(r) * zScale
    out[2] = z * scale
    return out
}
},{}],57:[function(require,module,exports){
module.exports = rotateX;

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
    var p = [], r=[]
    //Translate point to the origin
    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]

    //perform rotation
    r[0] = p[0]
    r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c)
    r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c)

    //translate to correct position
    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]

    return out
}
},{}],58:[function(require,module,exports){
module.exports = rotateY;

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
    var p = [], r=[]
    //Translate point to the origin
    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]
  
    //perform rotation
    r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c)
    r[1] = p[1]
    r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c)
  
    //translate to correct position
    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]
  
    return out
}
},{}],59:[function(require,module,exports){
module.exports = rotateZ;

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
    var p = [], r=[]
    //Translate point to the origin
    p[0] = a[0] - b[0]
    p[1] = a[1] - b[1]
    p[2] = a[2] - b[2]
  
    //perform rotation
    r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c)
    r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c)
    r[2] = p[2]
  
    //translate to correct position
    out[0] = r[0] + b[0]
    out[1] = r[1] + b[1]
    out[2] = r[2] + b[2]
  
    return out
}
},{}],60:[function(require,module,exports){
module.exports = scale;

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
    out[0] = a[0] * b
    out[1] = a[1] * b
    out[2] = a[2] * b
    return out
}
},{}],61:[function(require,module,exports){
module.exports = scaleAndAdd;

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
    out[0] = a[0] + (b[0] * scale)
    out[1] = a[1] + (b[1] * scale)
    out[2] = a[2] + (b[2] * scale)
    return out
}
},{}],62:[function(require,module,exports){
module.exports = set;

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
    out[0] = x
    out[1] = y
    out[2] = z
    return out
}
},{}],63:[function(require,module,exports){
module.exports = squaredDistance;

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
    var x = b[0] - a[0],
        y = b[1] - a[1],
        z = b[2] - a[2]
    return x*x + y*y + z*z
}
},{}],64:[function(require,module,exports){
module.exports = squaredLength;

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
    var x = a[0],
        y = a[1],
        z = a[2]
    return x*x + y*y + z*z
}
},{}],65:[function(require,module,exports){
module.exports = subtract;

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
    out[0] = a[0] - b[0]
    out[1] = a[1] - b[1]
    out[2] = a[2] - b[2]
    return out
}
},{}],66:[function(require,module,exports){
module.exports = transformMat3;

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
    var x = a[0], y = a[1], z = a[2]
    out[0] = x * m[0] + y * m[3] + z * m[6]
    out[1] = x * m[1] + y * m[4] + z * m[7]
    out[2] = x * m[2] + y * m[5] + z * m[8]
    return out
}
},{}],67:[function(require,module,exports){
module.exports = transformMat4;

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2],
        w = m[3] * x + m[7] * y + m[11] * z + m[15]
    w = w || 1.0
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w
    return out
}
},{}],68:[function(require,module,exports){
module.exports = transformQuat;

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
    // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

    var x = a[0], y = a[1], z = a[2],
        qx = q[0], qy = q[1], qz = q[2], qw = q[3],

        // calculate quat * vec
        ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z

    // calculate result * inverse quat
    out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
    out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
    out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
    return out
}
},{}],69:[function(require,module,exports){
module.exports = function(strings) {
  if (typeof strings === 'string') strings = [strings]
  var exprs = [].slice.call(arguments,1)
  var parts = []
  for (var i = 0; i < strings.length-1; i++) {
    parts.push(strings[i], exprs[i] || '')
  }
  parts.push(strings[i])
  return parts.join('')
}

},{}],70:[function(require,module,exports){
function createCube(sx, sy, sz, nx, ny, nz) {
    if (sx === undefined) sx = 1.0;
    if (sy === undefined) sy = sx;
    if (sz === undefined) sz = sx;

    if (nx === undefined) nx = 1.0;
    if (ny === undefined) ny = nx;
    if (nz === undefined) nz = nx;

    var x = sx / 2;
    var y = sy / 2;
    var z = sz / 2;

    var numVertices = (nx + 1) * (ny + 1) * 2 + (nx + 1) * (nz + 1) * 2 + (nz + 1) * (ny + 1) * 2;

    var vertexIndex = 0;
    var positions = [];
    var normals = [];
    var uvs = [];
    var cells = [];

    function makePlane(u, v, w, su, sv, nu, nv, pw, flipu, flipv) {
        var vertShift = vertexIndex;
        for(var j=0; j<=nv; j++) {
            for(var i=0; i<=nu; i++) {
                var vert = positions[vertexIndex] = [0,0,0];
                vert[u] = (-su/2 + i*su/nu) * flipu;
                vert[v] = (-sv/2 + j*sv/nv) * flipv;
                vert[w] = pw

                var normal = normals[vertexIndex] = [0,0,0];
                normal[u] = 0
                normal[v] = 0
                normal[w] = pw/Math.abs(pw);

                var texCoord = uvs[vertexIndex] = [0,0];
                texCoord[0] = i/nu;
                texCoord[1] = 1.0 - j/nv;

                ++vertexIndex;
            }
        }

        for(var j=0; j<nv; j++) {
            for(var i=0; i<nu; i++) {
                var n = vertShift + j * (nu + 1) + i
                cells.push([n, n + nu  + 1, n + nu + 2]);
                cells.push([n, n + nu + 2, n + 1]);
            }
        }
    }

     makePlane(0, 1, 2, sx, sy, nx, ny,  sz/2,  1, -1); //front
     makePlane(0, 1, 2, sx, sy, nx, ny, -sz/2, -1, -1); //back
     makePlane(2, 1, 0, sz, sy, nz, ny, -sx/2,  1, -1); //left
     makePlane(2, 1, 0, sz, sy, nz, ny,  sx/2, -1, -1); //right
     makePlane(0, 2, 1, sx, sz, nx, nz,  sy/2,  1,  1); //top
     makePlane(0, 2, 1, sx, sz, nx, nz, -sy/2,  1, -1); //bottom

    return {
        positions: positions,
        normals: normals,
        uvs: uvs,
        cells: cells
    }
}

module.exports = createCube;

},{}],71:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.createREGL = factory());
}(this, (function () { 'use strict';

var arrayTypes =  {
	"[object Int8Array]": 5120,
	"[object Int16Array]": 5122,
	"[object Int32Array]": 5124,
	"[object Uint8Array]": 5121,
	"[object Uint8ClampedArray]": 5121,
	"[object Uint16Array]": 5123,
	"[object Uint32Array]": 5125,
	"[object Float32Array]": 5126,
	"[object Float64Array]": 5121,
	"[object ArrayBuffer]": 5121
};

var isTypedArray = function (x) {
  return Object.prototype.toString.call(x) in arrayTypes
};

var extend = function (base, opts) {
  var keys = Object.keys(opts);
  for (var i = 0; i < keys.length; ++i) {
    base[keys[i]] = opts[keys[i]];
  }
  return base
};

// Error checking and parameter validation.
//
// Statements for the form `check.someProcedure(...)` get removed by
// a browserify transform for optimized/minified bundles.
//
/* globals btoa */
// only used for extracting shader names.  if btoa not present, then errors
// will be slightly crappier
function decodeB64 (str) {
  if (typeof btoa !== 'undefined') {
    return btoa(str)
  }
  return 'base64:' + str
}

function raise (message) {
  var error = new Error('(regl) ' + message);
  console.error(error);
  throw error
}

function check (pred, message) {
  if (!pred) {
    raise(message);
  }
}

function encolon (message) {
  if (message) {
    return ': ' + message
  }
  return ''
}

function checkParameter (param, possibilities, message) {
  if (!(param in possibilities)) {
    raise('unknown parameter (' + param + ')' + encolon(message) +
          '. possible values: ' + Object.keys(possibilities).join());
  }
}

function checkIsTypedArray (data, message) {
  if (!isTypedArray(data)) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. must be a typed array');
  }
}

function checkTypeOf (value, type, message) {
  if (typeof value !== type) {
    raise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value));
  }
}

function checkNonNegativeInt (value, message) {
  if (!((value >= 0) &&
        ((value | 0) === value))) {
    raise('invalid parameter type, (' + value + ')' + encolon(message) +
          '. must be a nonnegative integer');
  }
}

function checkOneOf (value, list, message) {
  if (list.indexOf(value) < 0) {
    raise('invalid value' + encolon(message) + '. must be one of: ' + list);
  }
}

var constructorKeys = [
  'gl',
  'canvas',
  'container',
  'attributes',
  'pixelRatio',
  'extensions',
  'optionalExtensions',
  'profile',
  'onDone'
];

function checkConstructor (obj) {
  Object.keys(obj).forEach(function (key) {
    if (constructorKeys.indexOf(key) < 0) {
      raise('invalid regl constructor argument "' + key + '". must be one of ' + constructorKeys);
    }
  });
}

function leftPad (str, n) {
  str = str + '';
  while (str.length < n) {
    str = ' ' + str;
  }
  return str
}

function ShaderFile () {
  this.name = 'unknown';
  this.lines = [];
  this.index = {};
  this.hasErrors = false;
}

function ShaderLine (number, line) {
  this.number = number;
  this.line = line;
  this.errors = [];
}

function ShaderError (fileNumber, lineNumber, message) {
  this.file = fileNumber;
  this.line = lineNumber;
  this.message = message;
}

function guessCommand () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /compileProcedure.*\n\s*at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /compileProcedure.*\n\s*at\s+(.*)(\n|$)/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function guessCallSite () {
  var error = new Error();
  var stack = (error.stack || error).toString();
  var pat = /at REGLCommand.*\n\s+at.*\((.*)\)/.exec(stack);
  if (pat) {
    return pat[1]
  }
  var pat2 = /at REGLCommand.*\n\s+at\s+(.*)\n/.exec(stack);
  if (pat2) {
    return pat2[1]
  }
  return 'unknown'
}

function parseSource (source, command) {
  var lines = source.split('\n');
  var lineNumber = 1;
  var fileNumber = 0;
  var files = {
    unknown: new ShaderFile(),
    0: new ShaderFile()
  };
  files.unknown.name = files[0].name = command || guessCommand();
  files.unknown.lines.push(new ShaderLine(0, ''));
  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    var parts = /^\s*\#\s*(\w+)\s+(.+)\s*$/.exec(line);
    if (parts) {
      switch (parts[1]) {
        case 'line':
          var lineNumberInfo = /(\d+)(\s+\d+)?/.exec(parts[2]);
          if (lineNumberInfo) {
            lineNumber = lineNumberInfo[1] | 0;
            if (lineNumberInfo[2]) {
              fileNumber = lineNumberInfo[2] | 0;
              if (!(fileNumber in files)) {
                files[fileNumber] = new ShaderFile();
              }
            }
          }
          break
        case 'define':
          var nameInfo = /SHADER_NAME(_B64)?\s+(.*)$/.exec(parts[2]);
          if (nameInfo) {
            files[fileNumber].name = (nameInfo[1]
                ? decodeB64(nameInfo[2])
                : nameInfo[2]);
          }
          break
      }
    }
    files[fileNumber].lines.push(new ShaderLine(lineNumber++, line));
  }
  Object.keys(files).forEach(function (fileNumber) {
    var file = files[fileNumber];
    file.lines.forEach(function (line) {
      file.index[line.number] = line;
    });
  });
  return files
}

function parseErrorLog (errLog) {
  var result = [];
  errLog.split('\n').forEach(function (errMsg) {
    if (errMsg.length < 5) {
      return
    }
    var parts = /^ERROR\:\s+(\d+)\:(\d+)\:\s*(.*)$/.exec(errMsg);
    if (parts) {
      result.push(new ShaderError(
        parts[1] | 0,
        parts[2] | 0,
        parts[3].trim()));
    } else if (errMsg.length > 0) {
      result.push(new ShaderError('unknown', 0, errMsg));
    }
  });
  return result
}

function annotateFiles (files, errors) {
  errors.forEach(function (error) {
    var file = files[error.file];
    if (file) {
      var line = file.index[error.line];
      if (line) {
        line.errors.push(error);
        file.hasErrors = true;
        return
      }
    }
    files.unknown.hasErrors = true;
    files.unknown.lines[0].errors.push(error);
  });
}

function checkShaderError (gl, shader, source, type, command) {
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var errLog = gl.getShaderInfoLog(shader);
    var typeName = type === gl.FRAGMENT_SHADER ? 'fragment' : 'vertex';
    checkCommandType(source, 'string', typeName + ' shader source must be a string', command);
    var files = parseSource(source, command);
    var errors = parseErrorLog(errLog);
    annotateFiles(files, errors);

    Object.keys(files).forEach(function (fileNumber) {
      var file = files[fileNumber];
      if (!file.hasErrors) {
        return
      }

      var strings = [''];
      var styles = [''];

      function push (str, style) {
        strings.push(str);
        styles.push(style || '');
      }

      push('file number ' + fileNumber + ': ' + file.name + '\n', 'color:red;text-decoration:underline;font-weight:bold');

      file.lines.forEach(function (line) {
        if (line.errors.length > 0) {
          push(leftPad(line.number, 4) + '|  ', 'background-color:yellow; font-weight:bold');
          push(line.line + '\n', 'color:red; background-color:yellow; font-weight:bold');

          // try to guess token
          var offset = 0;
          line.errors.forEach(function (error) {
            var message = error.message;
            var token = /^\s*\'(.*)\'\s*\:\s*(.*)$/.exec(message);
            if (token) {
              var tokenPat = token[1];
              message = token[2];
              switch (tokenPat) {
                case 'assign':
                  tokenPat = '=';
                  break
              }
              offset = Math.max(line.line.indexOf(tokenPat, offset), 0);
            } else {
              offset = 0;
            }

            push(leftPad('| ', 6));
            push(leftPad('^^^', offset + 3) + '\n', 'font-weight:bold');
            push(leftPad('| ', 6));
            push(message + '\n', 'font-weight:bold');
          });
          push(leftPad('| ', 6) + '\n');
        } else {
          push(leftPad(line.number, 4) + '|  ');
          push(line.line + '\n', 'color:red');
        }
      });
      if (typeof document !== 'undefined') {
        styles[0] = strings.join('%c');
        console.log.apply(console, styles);
      } else {
        console.log(strings.join(''));
      }
    });

    check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name);
  }
}

function checkLinkError (gl, program, fragShader, vertShader, command) {
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    var errLog = gl.getProgramInfoLog(program);
    var fragParse = parseSource(fragShader, command);
    var vertParse = parseSource(vertShader, command);

    var header = 'Error linking program with vertex shader, "' +
      vertParse[0].name + '", and fragment shader "' + fragParse[0].name + '"';

    if (typeof document !== 'undefined') {
      console.log('%c' + header + '\n%c' + errLog,
        'color:red;text-decoration:underline;font-weight:bold',
        'color:red');
    } else {
      console.log(header + '\n' + errLog);
    }
    check.raise(header);
  }
}

function saveCommandRef (object) {
  object._commandRef = guessCommand();
}

function saveDrawCommandInfo (opts, uniforms, attributes, stringStore) {
  saveCommandRef(opts);

  function id (str) {
    if (str) {
      return stringStore.id(str)
    }
    return 0
  }
  opts._fragId = id(opts.static.frag);
  opts._vertId = id(opts.static.vert);

  function addProps (dict, set) {
    Object.keys(set).forEach(function (u) {
      dict[stringStore.id(u)] = true;
    });
  }

  var uniformSet = opts._uniformSet = {};
  addProps(uniformSet, uniforms.static);
  addProps(uniformSet, uniforms.dynamic);

  var attributeSet = opts._attributeSet = {};
  addProps(attributeSet, attributes.static);
  addProps(attributeSet, attributes.dynamic);

  opts._hasCount = (
    'count' in opts.static ||
    'count' in opts.dynamic ||
    'elements' in opts.static ||
    'elements' in opts.dynamic);
}

function commandRaise (message, command) {
  var callSite = guessCallSite();
  raise(message +
    ' in command ' + (command || guessCommand()) +
    (callSite === 'unknown' ? '' : ' called from ' + callSite));
}

function checkCommand (pred, message, command) {
  if (!pred) {
    commandRaise(message, command || guessCommand());
  }
}

function checkParameterCommand (param, possibilities, message, command) {
  if (!(param in possibilities)) {
    commandRaise(
      'unknown parameter (' + param + ')' + encolon(message) +
      '. possible values: ' + Object.keys(possibilities).join(),
      command || guessCommand());
  }
}

function checkCommandType (value, type, message, command) {
  if (typeof value !== type) {
    commandRaise(
      'invalid parameter type' + encolon(message) +
      '. expected ' + type + ', got ' + (typeof value),
      command || guessCommand());
  }
}

function checkOptional (block) {
  block();
}

function checkFramebufferFormat (attachment, texFormats, rbFormats) {
  if (attachment.texture) {
    checkOneOf(
      attachment.texture._texture.internalformat,
      texFormats,
      'unsupported texture format for attachment');
  } else {
    checkOneOf(
      attachment.renderbuffer._renderbuffer.format,
      rbFormats,
      'unsupported renderbuffer format for attachment');
  }
}

var GL_CLAMP_TO_EDGE = 0x812F;

var GL_NEAREST = 0x2600;
var GL_NEAREST_MIPMAP_NEAREST = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR = 0x2703;

var GL_BYTE = 5120;
var GL_UNSIGNED_BYTE = 5121;
var GL_SHORT = 5122;
var GL_UNSIGNED_SHORT = 5123;
var GL_INT = 5124;
var GL_UNSIGNED_INT = 5125;
var GL_FLOAT = 5126;

var GL_UNSIGNED_SHORT_4_4_4_4 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL = 0x84FA;

var GL_HALF_FLOAT_OES = 0x8D61;

var TYPE_SIZE = {};

TYPE_SIZE[GL_BYTE] =
TYPE_SIZE[GL_UNSIGNED_BYTE] = 1;

TYPE_SIZE[GL_SHORT] =
TYPE_SIZE[GL_UNSIGNED_SHORT] =
TYPE_SIZE[GL_HALF_FLOAT_OES] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_6_5] =
TYPE_SIZE[GL_UNSIGNED_SHORT_4_4_4_4] =
TYPE_SIZE[GL_UNSIGNED_SHORT_5_5_5_1] = 2;

TYPE_SIZE[GL_INT] =
TYPE_SIZE[GL_UNSIGNED_INT] =
TYPE_SIZE[GL_FLOAT] =
TYPE_SIZE[GL_UNSIGNED_INT_24_8_WEBGL] = 4;

function pixelSize (type, channels) {
  if (type === GL_UNSIGNED_SHORT_5_5_5_1 ||
      type === GL_UNSIGNED_SHORT_4_4_4_4 ||
      type === GL_UNSIGNED_SHORT_5_6_5) {
    return 2
  } else if (type === GL_UNSIGNED_INT_24_8_WEBGL) {
    return 4
  } else {
    return TYPE_SIZE[type] * channels
  }
}

function isPow2 (v) {
  return !(v & (v - 1)) && (!!v)
}

function checkTexture2D (info, mipData, limits) {
  var i;
  var w = mipData.width;
  var h = mipData.height;
  var c = mipData.channels;

  // Check texture shape
  check(w > 0 && w <= limits.maxTextureSize &&
        h > 0 && h <= limits.maxTextureSize,
        'invalid texture shape');

  // check wrap mode
  if (info.wrapS !== GL_CLAMP_TO_EDGE || info.wrapT !== GL_CLAMP_TO_EDGE) {
    check(isPow2(w) && isPow2(h),
      'incompatible wrap mode for texture, both width and height must be power of 2');
  }

  if (mipData.mipmask === 1) {
    if (w !== 1 && h !== 1) {
      check(
        info.minFilter !== GL_NEAREST_MIPMAP_NEAREST &&
        info.minFilter !== GL_NEAREST_MIPMAP_LINEAR &&
        info.minFilter !== GL_LINEAR_MIPMAP_NEAREST &&
        info.minFilter !== GL_LINEAR_MIPMAP_LINEAR,
        'min filter requires mipmap');
    }
  } else {
    // texture must be power of 2
    check(isPow2(w) && isPow2(h),
      'texture must be a square power of 2 to support mipmapping');
    check(mipData.mipmask === (w << 1) - 1,
      'missing or incomplete mipmap data');
  }

  if (mipData.type === GL_FLOAT) {
    if (limits.extensions.indexOf('oes_texture_float_linear') < 0) {
      check(info.minFilter === GL_NEAREST && info.magFilter === GL_NEAREST,
        'filter not supported, must enable oes_texture_float_linear');
    }
    check(!info.genMipmaps,
      'mipmap generation not supported with float textures');
  }

  // check image complete
  var mipimages = mipData.images;
  for (i = 0; i < 16; ++i) {
    if (mipimages[i]) {
      var mw = w >> i;
      var mh = h >> i;
      check(mipData.mipmask & (1 << i), 'missing mipmap data');

      var img = mipimages[i];

      check(
        img.width === mw &&
        img.height === mh,
        'invalid shape for mip images');

      check(
        img.format === mipData.format &&
        img.internalformat === mipData.internalformat &&
        img.type === mipData.type,
        'incompatible type for mip image');

      if (img.compressed) {
        // TODO: check size for compressed images
      } else if (img.data) {
        // check(img.data.byteLength === mw * mh *
        // Math.max(pixelSize(img.type, c), img.unpackAlignment),
        var rowSize = Math.ceil(pixelSize(img.type, c) * mw / img.unpackAlignment) * img.unpackAlignment;
        check(img.data.byteLength === rowSize * mh,
          'invalid data for image, buffer size is inconsistent with image format');
      } else if (img.element) {
        // TODO: check element can be loaded
      } else if (img.copy) {
        // TODO: check compatible format and type
      }
    } else if (!info.genMipmaps) {
      check((mipData.mipmask & (1 << i)) === 0, 'extra mipmap data');
    }
  }

  if (mipData.compressed) {
    check(!info.genMipmaps,
      'mipmap generation for compressed images not supported');
  }
}

function checkTextureCube (texture, info, faces, limits) {
  var w = texture.width;
  var h = texture.height;
  var c = texture.channels;

  // Check texture shape
  check(
    w > 0 && w <= limits.maxTextureSize && h > 0 && h <= limits.maxTextureSize,
    'invalid texture shape');
  check(
    w === h,
    'cube map must be square');
  check(
    info.wrapS === GL_CLAMP_TO_EDGE && info.wrapT === GL_CLAMP_TO_EDGE,
    'wrap mode not supported by cube map');

  for (var i = 0; i < faces.length; ++i) {
    var face = faces[i];
    check(
      face.width === w && face.height === h,
      'inconsistent cube map face shape');

    if (info.genMipmaps) {
      check(!face.compressed,
        'can not generate mipmap for compressed textures');
      check(face.mipmask === 1,
        'can not specify mipmaps and generate mipmaps');
    } else {
      // TODO: check mip and filter mode
    }

    var mipmaps = face.images;
    for (var j = 0; j < 16; ++j) {
      var img = mipmaps[j];
      if (img) {
        var mw = w >> j;
        var mh = h >> j;
        check(face.mipmask & (1 << j), 'missing mipmap data');
        check(
          img.width === mw &&
          img.height === mh,
          'invalid shape for mip images');
        check(
          img.format === texture.format &&
          img.internalformat === texture.internalformat &&
          img.type === texture.type,
          'incompatible type for mip image');

        if (img.compressed) {
          // TODO: check size for compressed images
        } else if (img.data) {
          check(img.data.byteLength === mw * mh *
            Math.max(pixelSize(img.type, c), img.unpackAlignment),
            'invalid data for image, buffer size is inconsistent with image format');
        } else if (img.element) {
          // TODO: check element can be loaded
        } else if (img.copy) {
          // TODO: check compatible format and type
        }
      }
    }
  }
}

var check$1 = extend(check, {
  optional: checkOptional,
  raise: raise,
  commandRaise: commandRaise,
  command: checkCommand,
  parameter: checkParameter,
  commandParameter: checkParameterCommand,
  constructor: checkConstructor,
  type: checkTypeOf,
  commandType: checkCommandType,
  isTypedArray: checkIsTypedArray,
  nni: checkNonNegativeInt,
  oneOf: checkOneOf,
  shaderError: checkShaderError,
  linkError: checkLinkError,
  callSite: guessCallSite,
  saveCommandRef: saveCommandRef,
  saveDrawInfo: saveDrawCommandInfo,
  framebufferFormat: checkFramebufferFormat,
  guessCommand: guessCommand,
  texture2D: checkTexture2D,
  textureCube: checkTextureCube
});

var VARIABLE_COUNTER = 0;

var DYN_FUNC = 0;

function DynamicVariable (type, data) {
  this.id = (VARIABLE_COUNTER++);
  this.type = type;
  this.data = data;
}

function escapeStr (str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function splitParts (str) {
  if (str.length === 0) {
    return []
  }

  var firstChar = str.charAt(0);
  var lastChar = str.charAt(str.length - 1);

  if (str.length > 1 &&
      firstChar === lastChar &&
      (firstChar === '"' || firstChar === "'")) {
    return ['"' + escapeStr(str.substr(1, str.length - 2)) + '"']
  }

  var parts = /\[(false|true|null|\d+|'[^']*'|"[^"]*")\]/.exec(str);
  if (parts) {
    return (
      splitParts(str.substr(0, parts.index))
      .concat(splitParts(parts[1]))
      .concat(splitParts(str.substr(parts.index + parts[0].length)))
    )
  }

  var subparts = str.split('.');
  if (subparts.length === 1) {
    return ['"' + escapeStr(str) + '"']
  }

  var result = [];
  for (var i = 0; i < subparts.length; ++i) {
    result = result.concat(splitParts(subparts[i]));
  }
  return result
}

function toAccessorString (str) {
  return '[' + splitParts(str).join('][') + ']'
}

function defineDynamic (type, data) {
  return new DynamicVariable(type, toAccessorString(data + ''))
}

function isDynamic (x) {
  return (typeof x === 'function' && !x._reglType) ||
         x instanceof DynamicVariable
}

function unbox (x, path) {
  if (typeof x === 'function') {
    return new DynamicVariable(DYN_FUNC, x)
  }
  return x
}

var dynamic = {
  DynamicVariable: DynamicVariable,
  define: defineDynamic,
  isDynamic: isDynamic,
  unbox: unbox,
  accessor: toAccessorString
};

/* globals requestAnimationFrame, cancelAnimationFrame */
var raf = {
  next: typeof requestAnimationFrame === 'function'
    ? function (cb) { return requestAnimationFrame(cb) }
    : function (cb) { return setTimeout(cb, 16) },
  cancel: typeof cancelAnimationFrame === 'function'
    ? function (raf) { return cancelAnimationFrame(raf) }
    : clearTimeout
};

/* globals performance */
var clock = (typeof performance !== 'undefined' && performance.now)
  ? function () { return performance.now() }
  : function () { return +(new Date()) };

function createStringStore () {
  var stringIds = {'': 0};
  var stringValues = [''];
  return {
    id: function (str) {
      var result = stringIds[str];
      if (result) {
        return result
      }
      result = stringIds[str] = stringValues.length;
      stringValues.push(str);
      return result
    },

    str: function (id) {
      return stringValues[id]
    }
  }
}

// Context and canvas creation helper functions
function createCanvas (element, onDone, pixelRatio) {
  var canvas = document.createElement('canvas');
  extend(canvas.style, {
    border: 0,
    margin: 0,
    padding: 0,
    top: 0,
    left: 0
  });
  element.appendChild(canvas);

  if (element === document.body) {
    canvas.style.position = 'absolute';
    extend(element.style, {
      margin: 0,
      padding: 0
    });
  }

  function resize () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (element !== document.body) {
      var bounds = element.getBoundingClientRect();
      w = bounds.right - bounds.left;
      h = bounds.bottom - bounds.top;
    }
    canvas.width = pixelRatio * w;
    canvas.height = pixelRatio * h;
    extend(canvas.style, {
      width: w + 'px',
      height: h + 'px'
    });
  }

  window.addEventListener('resize', resize, false);

  function onDestroy () {
    window.removeEventListener('resize', resize);
    element.removeChild(canvas);
  }

  resize();

  return {
    canvas: canvas,
    onDestroy: onDestroy
  }
}

function createContext (canvas, contexAttributes) {
  function get (name) {
    try {
      return canvas.getContext(name, contexAttributes)
    } catch (e) {
      return null
    }
  }
  return (
    get('webgl') ||
    get('experimental-webgl') ||
    get('webgl-experimental')
  )
}

function isHTMLElement (obj) {
  return (
    typeof obj.nodeName === 'string' &&
    typeof obj.appendChild === 'function' &&
    typeof obj.getBoundingClientRect === 'function'
  )
}

function isWebGLContext (obj) {
  return (
    typeof obj.drawArrays === 'function' ||
    typeof obj.drawElements === 'function'
  )
}

function parseExtensions (input) {
  if (typeof input === 'string') {
    return input.split()
  }
  check$1(Array.isArray(input), 'invalid extension array');
  return input
}

function getElement (desc) {
  if (typeof desc === 'string') {
    check$1(typeof document !== 'undefined', 'not supported outside of DOM');
    return document.querySelector(desc)
  }
  return desc
}

function parseArgs (args_) {
  var args = args_ || {};
  var element, container, canvas, gl;
  var contextAttributes = {};
  var extensions = [];
  var optionalExtensions = [];
  var pixelRatio = (typeof window === 'undefined' ? 1 : window.devicePixelRatio);
  var profile = false;
  var onDone = function (err) {
    if (err) {
      check$1.raise(err);
    }
  };
  var onDestroy = function () {};
  if (typeof args === 'string') {
    check$1(
      typeof document !== 'undefined',
      'selector queries only supported in DOM enviroments');
    element = document.querySelector(args);
    check$1(element, 'invalid query string for element');
  } else if (typeof args === 'object') {
    if (isHTMLElement(args)) {
      element = args;
    } else if (isWebGLContext(args)) {
      gl = args;
      canvas = gl.canvas;
    } else {
      check$1.constructor(args);
      if ('gl' in args) {
        gl = args.gl;
      } else if ('canvas' in args) {
        canvas = getElement(args.canvas);
      } else if ('container' in args) {
        container = getElement(args.container);
      }
      if ('attributes' in args) {
        contextAttributes = args.attributes;
        check$1.type(contextAttributes, 'object', 'invalid context attributes');
      }
      if ('extensions' in args) {
        extensions = parseExtensions(args.extensions);
      }
      if ('optionalExtensions' in args) {
        optionalExtensions = parseExtensions(args.optionalExtensions);
      }
      if ('onDone' in args) {
        check$1.type(
          args.onDone, 'function',
          'invalid or missing onDone callback');
        onDone = args.onDone;
      }
      if ('profile' in args) {
        profile = !!args.profile;
      }
      if ('pixelRatio' in args) {
        pixelRatio = +args.pixelRatio;
        check$1(pixelRatio > 0, 'invalid pixel ratio');
      }
    }
  } else {
    check$1.raise('invalid arguments to regl');
  }

  if (element) {
    if (element.nodeName.toLowerCase() === 'canvas') {
      canvas = element;
    } else {
      container = element;
    }
  }

  if (!gl) {
    if (!canvas) {
      check$1(
        typeof document !== 'undefined',
        'must manually specify webgl context outside of DOM environments');
      var result = createCanvas(container || document.body, onDone, pixelRatio);
      if (!result) {
        return null
      }
      canvas = result.canvas;
      onDestroy = result.onDestroy;
    }
    gl = createContext(canvas, contextAttributes);
  }

  if (!gl) {
    onDestroy();
    onDone('webgl not supported, try upgrading your browser or graphics drivers http://get.webgl.org');
    return null
  }

  return {
    gl: gl,
    canvas: canvas,
    container: container,
    extensions: extensions,
    optionalExtensions: optionalExtensions,
    pixelRatio: pixelRatio,
    profile: profile,
    onDone: onDone,
    onDestroy: onDestroy
  }
}

function createExtensionCache (gl, config) {
  var extensions = {};

  function tryLoadExtension (name_) {
    check$1.type(name_, 'string', 'extension name must be string');
    var name = name_.toLowerCase();
    var ext;
    try {
      ext = extensions[name] = gl.getExtension(name);
    } catch (e) {}
    return !!ext
  }

  for (var i = 0; i < config.extensions.length; ++i) {
    var name = config.extensions[i];
    if (!tryLoadExtension(name)) {
      config.onDestroy();
      config.onDone('"' + name + '" extension is not supported by the current WebGL context, try upgrading your system or a different browser');
      return null
    }
  }

  config.optionalExtensions.forEach(tryLoadExtension);

  return {
    extensions: extensions,
    restore: function () {
      Object.keys(extensions).forEach(function (name) {
        if (!tryLoadExtension(name)) {
          throw new Error('(regl): error restoring extension ' + name)
        }
      });
    }
  }
}

var GL_SUBPIXEL_BITS = 0x0D50;
var GL_RED_BITS = 0x0D52;
var GL_GREEN_BITS = 0x0D53;
var GL_BLUE_BITS = 0x0D54;
var GL_ALPHA_BITS = 0x0D55;
var GL_DEPTH_BITS = 0x0D56;
var GL_STENCIL_BITS = 0x0D57;

var GL_ALIASED_POINT_SIZE_RANGE = 0x846D;
var GL_ALIASED_LINE_WIDTH_RANGE = 0x846E;

var GL_MAX_TEXTURE_SIZE = 0x0D33;
var GL_MAX_VIEWPORT_DIMS = 0x0D3A;
var GL_MAX_VERTEX_ATTRIBS = 0x8869;
var GL_MAX_VERTEX_UNIFORM_VECTORS = 0x8DFB;
var GL_MAX_VARYING_VECTORS = 0x8DFC;
var GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8B4D;
var GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8B4C;
var GL_MAX_TEXTURE_IMAGE_UNITS = 0x8872;
var GL_MAX_FRAGMENT_UNIFORM_VECTORS = 0x8DFD;
var GL_MAX_CUBE_MAP_TEXTURE_SIZE = 0x851C;
var GL_MAX_RENDERBUFFER_SIZE = 0x84E8;

var GL_VENDOR = 0x1F00;
var GL_RENDERER = 0x1F01;
var GL_VERSION = 0x1F02;
var GL_SHADING_LANGUAGE_VERSION = 0x8B8C;

var GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FF;

var GL_MAX_COLOR_ATTACHMENTS_WEBGL = 0x8CDF;
var GL_MAX_DRAW_BUFFERS_WEBGL = 0x8824;

var wrapLimits = function (gl, extensions) {
  var maxAnisotropic = 1;
  if (extensions.ext_texture_filter_anisotropic) {
    maxAnisotropic = gl.getParameter(GL_MAX_TEXTURE_MAX_ANISOTROPY_EXT);
  }

  var maxDrawbuffers = 1;
  var maxColorAttachments = 1;
  if (extensions.webgl_draw_buffers) {
    maxDrawbuffers = gl.getParameter(GL_MAX_DRAW_BUFFERS_WEBGL);
    maxColorAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
  }

  return {
    // drawing buffer bit depth
    colorBits: [
      gl.getParameter(GL_RED_BITS),
      gl.getParameter(GL_GREEN_BITS),
      gl.getParameter(GL_BLUE_BITS),
      gl.getParameter(GL_ALPHA_BITS)
    ],
    depthBits: gl.getParameter(GL_DEPTH_BITS),
    stencilBits: gl.getParameter(GL_STENCIL_BITS),
    subpixelBits: gl.getParameter(GL_SUBPIXEL_BITS),

    // supported extensions
    extensions: Object.keys(extensions).filter(function (ext) {
      return !!extensions[ext]
    }),

    // max aniso samples
    maxAnisotropic: maxAnisotropic,

    // max draw buffers
    maxDrawbuffers: maxDrawbuffers,
    maxColorAttachments: maxColorAttachments,

    // point and line size ranges
    pointSizeDims: gl.getParameter(GL_ALIASED_POINT_SIZE_RANGE),
    lineWidthDims: gl.getParameter(GL_ALIASED_LINE_WIDTH_RANGE),
    maxViewportDims: gl.getParameter(GL_MAX_VIEWPORT_DIMS),
    maxCombinedTextureUnits: gl.getParameter(GL_MAX_COMBINED_TEXTURE_IMAGE_UNITS),
    maxCubeMapSize: gl.getParameter(GL_MAX_CUBE_MAP_TEXTURE_SIZE),
    maxRenderbufferSize: gl.getParameter(GL_MAX_RENDERBUFFER_SIZE),
    maxTextureUnits: gl.getParameter(GL_MAX_TEXTURE_IMAGE_UNITS),
    maxTextureSize: gl.getParameter(GL_MAX_TEXTURE_SIZE),
    maxAttributes: gl.getParameter(GL_MAX_VERTEX_ATTRIBS),
    maxVertexUniforms: gl.getParameter(GL_MAX_VERTEX_UNIFORM_VECTORS),
    maxVertexTextureUnits: gl.getParameter(GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    maxVaryingVectors: gl.getParameter(GL_MAX_VARYING_VECTORS),
    maxFragmentUniforms: gl.getParameter(GL_MAX_FRAGMENT_UNIFORM_VECTORS),

    // vendor info
    glsl: gl.getParameter(GL_SHADING_LANGUAGE_VERSION),
    renderer: gl.getParameter(GL_RENDERER),
    vendor: gl.getParameter(GL_VENDOR),
    version: gl.getParameter(GL_VERSION)
  }
};

function isNDArrayLike (obj) {
  return (
    !!obj &&
    typeof obj === 'object' &&
    Array.isArray(obj.shape) &&
    Array.isArray(obj.stride) &&
    typeof obj.offset === 'number' &&
    obj.shape.length === obj.stride.length &&
    (Array.isArray(obj.data) ||
      isTypedArray(obj.data)))
}

var values = function (obj) {
  return Object.keys(obj).map(function (key) { return obj[key] })
};

function loop (n, f) {
  var result = Array(n);
  for (var i = 0; i < n; ++i) {
    result[i] = f(i);
  }
  return result
}

var GL_BYTE$1 = 5120;
var GL_UNSIGNED_BYTE$2 = 5121;
var GL_SHORT$1 = 5122;
var GL_UNSIGNED_SHORT$1 = 5123;
var GL_INT$1 = 5124;
var GL_UNSIGNED_INT$1 = 5125;
var GL_FLOAT$2 = 5126;

var bufferPool = loop(8, function () {
  return []
});

function nextPow16 (v) {
  for (var i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i
    }
  }
  return 0
}

function log2 (v) {
  var r, shift;
  r = (v > 0xFFFF) << 4;
  v >>>= r;
  shift = (v > 0xFF) << 3;
  v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2;
  v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1;
  v >>>= shift; r |= shift;
  return r | (v >> 1)
}

function alloc (n) {
  var sz = nextPow16(n);
  var bin = bufferPool[log2(sz) >> 2];
  if (bin.length > 0) {
    return bin.pop()
  }
  return new ArrayBuffer(sz)
}

function free (buf) {
  bufferPool[log2(buf.byteLength) >> 2].push(buf);
}

function allocType (type, n) {
  var result = null;
  switch (type) {
    case GL_BYTE$1:
      result = new Int8Array(alloc(n), 0, n);
      break
    case GL_UNSIGNED_BYTE$2:
      result = new Uint8Array(alloc(n), 0, n);
      break
    case GL_SHORT$1:
      result = new Int16Array(alloc(2 * n), 0, n);
      break
    case GL_UNSIGNED_SHORT$1:
      result = new Uint16Array(alloc(2 * n), 0, n);
      break
    case GL_INT$1:
      result = new Int32Array(alloc(4 * n), 0, n);
      break
    case GL_UNSIGNED_INT$1:
      result = new Uint32Array(alloc(4 * n), 0, n);
      break
    case GL_FLOAT$2:
      result = new Float32Array(alloc(4 * n), 0, n);
      break
    default:
      return null
  }
  if (result.length !== n) {
    return result.subarray(0, n)
  }
  return result
}

function freeType (array) {
  free(array.buffer);
}

var pool = {
  alloc: alloc,
  free: free,
  allocType: allocType,
  freeType: freeType
};

var flattenUtils = {
  shape: arrayShape$1,
  flatten: flattenArray
};

function flatten1D (array, nx, out) {
  for (var i = 0; i < nx; ++i) {
    out[i] = array[i];
  }
}

function flatten2D (array, nx, ny, out) {
  var ptr = 0;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      out[ptr++] = row[j];
    }
  }
}

function flatten3D (array, nx, ny, nz, out, ptr_) {
  var ptr = ptr_;
  for (var i = 0; i < nx; ++i) {
    var row = array[i];
    for (var j = 0; j < ny; ++j) {
      var col = row[j];
      for (var k = 0; k < nz; ++k) {
        out[ptr++] = col[k];
      }
    }
  }
}

function flattenRec (array, shape, level, out, ptr) {
  var stride = 1;
  for (var i = level + 1; i < shape.length; ++i) {
    stride *= shape[i];
  }
  var n = shape[level];
  if (shape.length - level === 4) {
    var nx = shape[level + 1];
    var ny = shape[level + 2];
    var nz = shape[level + 3];
    for (i = 0; i < n; ++i) {
      flatten3D(array[i], nx, ny, nz, out, ptr);
      ptr += stride;
    }
  } else {
    for (i = 0; i < n; ++i) {
      flattenRec(array[i], shape, level + 1, out, ptr);
      ptr += stride;
    }
  }
}

function flattenArray (array, shape, type, out_) {
  var sz = 1;
  if (shape.length) {
    for (var i = 0; i < shape.length; ++i) {
      sz *= shape[i];
    }
  } else {
    sz = 0;
  }
  var out = out_ || pool.allocType(type, sz);
  switch (shape.length) {
    case 0:
      break
    case 1:
      flatten1D(array, shape[0], out);
      break
    case 2:
      flatten2D(array, shape[0], shape[1], out);
      break
    case 3:
      flatten3D(array, shape[0], shape[1], shape[2], out, 0);
      break
    default:
      flattenRec(array, shape, 0, out, 0);
  }
  return out
}

function arrayShape$1 (array_) {
  var shape = [];
  for (var array = array_; array.length; array = array[0]) {
    shape.push(array.length);
  }
  return shape
}

var int8 = 5120;
var int16 = 5122;
var int32 = 5124;
var uint8 = 5121;
var uint16 = 5123;
var uint32 = 5125;
var float = 5126;
var float32 = 5126;
var glTypes = {
	int8: int8,
	int16: int16,
	int32: int32,
	uint8: uint8,
	uint16: uint16,
	uint32: uint32,
	float: float,
	float32: float32
};

var dynamic$1 = 35048;
var stream = 35040;
var usageTypes = {
	dynamic: dynamic$1,
	stream: stream,
	"static": 35044
};

var arrayFlatten = flattenUtils.flatten;
var arrayShape = flattenUtils.shape;

var GL_STATIC_DRAW = 0x88E4;
var GL_STREAM_DRAW = 0x88E0;

var GL_UNSIGNED_BYTE$1 = 5121;
var GL_FLOAT$1 = 5126;

var DTYPES_SIZES = [];
DTYPES_SIZES[5120] = 1; // int8
DTYPES_SIZES[5122] = 2; // int16
DTYPES_SIZES[5124] = 4; // int32
DTYPES_SIZES[5121] = 1; // uint8
DTYPES_SIZES[5123] = 2; // uint16
DTYPES_SIZES[5125] = 4; // uint32
DTYPES_SIZES[5126] = 4; // float32

function typedArrayCode (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function copyArray (out, inp) {
  for (var i = 0; i < inp.length; ++i) {
    out[i] = inp[i];
  }
}

function transpose (
  result, data, shapeX, shapeY, strideX, strideY, offset) {
  var ptr = 0;
  for (var i = 0; i < shapeX; ++i) {
    for (var j = 0; j < shapeY; ++j) {
      result[ptr++] = data[strideX * i + strideY * j + offset];
    }
  }
}

function wrapBufferState (gl, stats, config) {
  var bufferCount = 0;
  var bufferSet = {};

  function REGLBuffer (type) {
    this.id = bufferCount++;
    this.buffer = gl.createBuffer();
    this.type = type;
    this.usage = GL_STATIC_DRAW;
    this.byteLength = 0;
    this.dimension = 1;
    this.dtype = GL_UNSIGNED_BYTE$1;

    this.persistentData = null;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLBuffer.prototype.bind = function () {
    gl.bindBuffer(this.type, this.buffer);
  };

  REGLBuffer.prototype.destroy = function () {
    destroy(this);
  };

  var streamPool = [];

  function createStream (type, data) {
    var buffer = streamPool.pop();
    if (!buffer) {
      buffer = new REGLBuffer(type);
    }
    buffer.bind();
    initBufferFromData(buffer, data, GL_STREAM_DRAW, 0, 1, false);
    return buffer
  }

  function destroyStream (stream$$1) {
    streamPool.push(stream$$1);
  }

  function initBufferFromTypedArray (buffer, data, usage) {
    buffer.byteLength = data.byteLength;
    gl.bufferData(buffer.type, data, usage);
  }

  function initBufferFromData (buffer, data, usage, dtype, dimension, persist) {
    var shape;
    buffer.usage = usage;
    if (Array.isArray(data)) {
      buffer.dtype = dtype || GL_FLOAT$1;
      if (data.length > 0) {
        var flatData;
        if (Array.isArray(data[0])) {
          shape = arrayShape(data);
          var dim = 1;
          for (var i = 1; i < shape.length; ++i) {
            dim *= shape[i];
          }
          buffer.dimension = dim;
          flatData = arrayFlatten(data, shape, buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else if (typeof data[0] === 'number') {
          buffer.dimension = dimension;
          var typedData = pool.allocType(buffer.dtype, data.length);
          copyArray(typedData, data);
          initBufferFromTypedArray(buffer, typedData, usage);
          if (persist) {
            buffer.persistentData = typedData;
          } else {
            pool.freeType(typedData);
          }
        } else if (isTypedArray(data[0])) {
          buffer.dimension = data[0].length;
          buffer.dtype = dtype || typedArrayCode(data[0]) || GL_FLOAT$1;
          flatData = arrayFlatten(
            data,
            [data.length, data[0].length],
            buffer.dtype);
          initBufferFromTypedArray(buffer, flatData, usage);
          if (persist) {
            buffer.persistentData = flatData;
          } else {
            pool.freeType(flatData);
          }
        } else {
          check$1.raise('invalid buffer data');
        }
      }
    } else if (isTypedArray(data)) {
      buffer.dtype = dtype || typedArrayCode(data);
      buffer.dimension = dimension;
      initBufferFromTypedArray(buffer, data, usage);
      if (persist) {
        buffer.persistentData = new Uint8Array(new Uint8Array(data.buffer));
      }
    } else if (isNDArrayLike(data)) {
      shape = data.shape;
      var stride = data.stride;
      var offset = data.offset;

      var shapeX = 0;
      var shapeY = 0;
      var strideX = 0;
      var strideY = 0;
      if (shape.length === 1) {
        shapeX = shape[0];
        shapeY = 1;
        strideX = stride[0];
        strideY = 0;
      } else if (shape.length === 2) {
        shapeX = shape[0];
        shapeY = shape[1];
        strideX = stride[0];
        strideY = stride[1];
      } else {
        check$1.raise('invalid shape');
      }

      buffer.dtype = dtype || typedArrayCode(data.data) || GL_FLOAT$1;
      buffer.dimension = shapeY;

      var transposeData = pool.allocType(buffer.dtype, shapeX * shapeY);
      transpose(transposeData,
        data.data,
        shapeX, shapeY,
        strideX, strideY,
        offset);
      initBufferFromTypedArray(buffer, transposeData, usage);
      if (persist) {
        buffer.persistentData = transposeData;
      } else {
        pool.freeType(transposeData);
      }
    } else {
      check$1.raise('invalid buffer data');
    }
  }

  function destroy (buffer) {
    stats.bufferCount--;

    var handle = buffer.buffer;
    check$1(handle, 'buffer must not be deleted already');
    gl.deleteBuffer(handle);
    buffer.buffer = null;
    delete bufferSet[buffer.id];
  }

  function createBuffer (options, type, deferInit, persistent) {
    stats.bufferCount++;

    var buffer = new REGLBuffer(type);
    bufferSet[buffer.id] = buffer;

    function reglBuffer (options) {
      var usage = GL_STATIC_DRAW;
      var data = null;
      var byteLength = 0;
      var dtype = 0;
      var dimension = 1;
      if (Array.isArray(options) ||
          isTypedArray(options) ||
          isNDArrayLike(options)) {
        data = options;
      } else if (typeof options === 'number') {
        byteLength = options | 0;
      } else if (options) {
        check$1.type(
          options, 'object',
          'buffer arguments must be an object, a number or an array');

        if ('data' in options) {
          check$1(
            data === null ||
            Array.isArray(data) ||
            isTypedArray(data) ||
            isNDArrayLike(data),
            'invalid data for buffer');
          data = options.data;
        }

        if ('usage' in options) {
          check$1.parameter(options.usage, usageTypes, 'invalid buffer usage');
          usage = usageTypes[options.usage];
        }

        if ('type' in options) {
          check$1.parameter(options.type, glTypes, 'invalid buffer type');
          dtype = glTypes[options.type];
        }

        if ('dimension' in options) {
          check$1.type(options.dimension, 'number', 'invalid dimension');
          dimension = options.dimension | 0;
        }

        if ('length' in options) {
          check$1.nni(byteLength, 'buffer length must be a nonnegative integer');
          byteLength = options.length | 0;
        }
      }

      buffer.bind();
      if (!data) {
        gl.bufferData(buffer.type, byteLength, usage);
        buffer.dtype = dtype || GL_UNSIGNED_BYTE$1;
        buffer.usage = usage;
        buffer.dimension = dimension;
        buffer.byteLength = byteLength;
      } else {
        initBufferFromData(buffer, data, usage, dtype, dimension, persistent);
      }

      if (config.profile) {
        buffer.stats.size = buffer.byteLength * DTYPES_SIZES[buffer.dtype];
      }

      return reglBuffer
    }

    function setSubData (data, offset) {
      check$1(offset + data.byteLength <= buffer.byteLength,
        'invalid buffer subdata call, buffer is too small. ' + ' Can\'t write data of size ' + data.byteLength + ' starting from offset ' + offset + ' to a buffer of size ' + buffer.byteLength);

      gl.bufferSubData(buffer.type, offset, data);
    }

    function subdata (data, offset_) {
      var offset = (offset_ || 0) | 0;
      var shape;
      buffer.bind();
      if (Array.isArray(data)) {
        if (data.length > 0) {
          if (typeof data[0] === 'number') {
            var converted = pool.allocType(buffer.dtype, data.length);
            copyArray(converted, data);
            setSubData(converted, offset);
            pool.freeType(converted);
          } else if (Array.isArray(data[0]) || isTypedArray(data[0])) {
            shape = arrayShape(data);
            var flatData = arrayFlatten(data, shape, buffer.dtype);
            setSubData(flatData, offset);
            pool.freeType(flatData);
          } else {
            check$1.raise('invalid buffer data');
          }
        }
      } else if (isTypedArray(data)) {
        setSubData(data, offset);
      } else if (isNDArrayLike(data)) {
        shape = data.shape;
        var stride = data.stride;

        var shapeX = 0;
        var shapeY = 0;
        var strideX = 0;
        var strideY = 0;
        if (shape.length === 1) {
          shapeX = shape[0];
          shapeY = 1;
          strideX = stride[0];
          strideY = 0;
        } else if (shape.length === 2) {
          shapeX = shape[0];
          shapeY = shape[1];
          strideX = stride[0];
          strideY = stride[1];
        } else {
          check$1.raise('invalid shape');
        }
        var dtype = Array.isArray(data.data)
          ? buffer.dtype
          : typedArrayCode(data.data);

        var transposeData = pool.allocType(dtype, shapeX * shapeY);
        transpose(transposeData,
          data.data,
          shapeX, shapeY,
          strideX, strideY,
          data.offset);
        setSubData(transposeData, offset);
        pool.freeType(transposeData);
      } else {
        check$1.raise('invalid data for buffer subdata');
      }
      return reglBuffer
    }

    if (!deferInit) {
      reglBuffer(options);
    }

    reglBuffer._reglType = 'buffer';
    reglBuffer._buffer = buffer;
    reglBuffer.subdata = subdata;
    if (config.profile) {
      reglBuffer.stats = buffer.stats;
    }
    reglBuffer.destroy = function () { destroy(buffer); };

    return reglBuffer
  }

  function restoreBuffers () {
    values(bufferSet).forEach(function (buffer) {
      buffer.buffer = gl.createBuffer();
      gl.bindBuffer(buffer.type, buffer.buffer);
      gl.bufferData(
        buffer.type, buffer.persistentData || buffer.byteLength, buffer.usage);
    });
  }

  if (config.profile) {
    stats.getTotalBufferSize = function () {
      var total = 0;
      // TODO: Right now, the streams are not part of the total count.
      Object.keys(bufferSet).forEach(function (key) {
        total += bufferSet[key].stats.size;
      });
      return total
    };
  }

  return {
    create: createBuffer,

    createStream: createStream,
    destroyStream: destroyStream,

    clear: function () {
      values(bufferSet).forEach(destroy);
      streamPool.forEach(destroy);
    },

    getBuffer: function (wrapper) {
      if (wrapper && wrapper._buffer instanceof REGLBuffer) {
        return wrapper._buffer
      }
      return null
    },

    restore: restoreBuffers,

    _initBuffer: initBufferFromData
  }
}

var points = 0;
var point = 0;
var lines = 1;
var line = 1;
var triangles = 4;
var triangle = 4;
var primTypes = {
	points: points,
	point: point,
	lines: lines,
	line: line,
	triangles: triangles,
	triangle: triangle,
	"line loop": 2,
	"line strip": 3,
	"triangle strip": 5,
	"triangle fan": 6
};

var GL_POINTS = 0;
var GL_LINES = 1;
var GL_TRIANGLES = 4;

var GL_BYTE$2 = 5120;
var GL_UNSIGNED_BYTE$3 = 5121;
var GL_SHORT$2 = 5122;
var GL_UNSIGNED_SHORT$2 = 5123;
var GL_INT$2 = 5124;
var GL_UNSIGNED_INT$2 = 5125;

var GL_ELEMENT_ARRAY_BUFFER = 34963;

var GL_STREAM_DRAW$1 = 0x88E0;
var GL_STATIC_DRAW$1 = 0x88E4;

function wrapElementsState (gl, extensions, bufferState, stats) {
  var elementSet = {};
  var elementCount = 0;

  var elementTypes = {
    'uint8': GL_UNSIGNED_BYTE$3,
    'uint16': GL_UNSIGNED_SHORT$2
  };

  if (extensions.oes_element_index_uint) {
    elementTypes.uint32 = GL_UNSIGNED_INT$2;
  }

  function REGLElementBuffer (buffer) {
    this.id = elementCount++;
    elementSet[this.id] = this;
    this.buffer = buffer;
    this.primType = GL_TRIANGLES;
    this.vertCount = 0;
    this.type = 0;
  }

  REGLElementBuffer.prototype.bind = function () {
    this.buffer.bind();
  };

  var bufferPool = [];

  function createElementStream (data) {
    var result = bufferPool.pop();
    if (!result) {
      result = new REGLElementBuffer(bufferState.create(
        null,
        GL_ELEMENT_ARRAY_BUFFER,
        true,
        false)._buffer);
    }
    initElements(result, data, GL_STREAM_DRAW$1, -1, -1, 0, 0);
    return result
  }

  function destroyElementStream (elements) {
    bufferPool.push(elements);
  }

  function initElements (
    elements,
    data,
    usage,
    prim,
    count,
    byteLength,
    type) {
    elements.buffer.bind();
    if (data) {
      var predictedType = type;
      if (!type && (
          !isTypedArray(data) ||
         (isNDArrayLike(data) && !isTypedArray(data.data)))) {
        predictedType = extensions.oes_element_index_uint
          ? GL_UNSIGNED_INT$2
          : GL_UNSIGNED_SHORT$2;
      }
      bufferState._initBuffer(
        elements.buffer,
        data,
        usage,
        predictedType,
        3);
    } else {
      gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, byteLength, usage);
      elements.buffer.dtype = dtype || GL_UNSIGNED_BYTE$3;
      elements.buffer.usage = usage;
      elements.buffer.dimension = 3;
      elements.buffer.byteLength = byteLength;
    }

    var dtype = type;
    if (!type) {
      switch (elements.buffer.dtype) {
        case GL_UNSIGNED_BYTE$3:
        case GL_BYTE$2:
          dtype = GL_UNSIGNED_BYTE$3;
          break

        case GL_UNSIGNED_SHORT$2:
        case GL_SHORT$2:
          dtype = GL_UNSIGNED_SHORT$2;
          break

        case GL_UNSIGNED_INT$2:
        case GL_INT$2:
          dtype = GL_UNSIGNED_INT$2;
          break

        default:
          check$1.raise('unsupported type for element array');
      }
      elements.buffer.dtype = dtype;
    }
    elements.type = dtype;

    // Check oes_element_index_uint extension
    check$1(
      dtype !== GL_UNSIGNED_INT$2 ||
      !!extensions.oes_element_index_uint,
      '32 bit element buffers not supported, enable oes_element_index_uint first');

    // try to guess default primitive type and arguments
    var vertCount = count;
    if (vertCount < 0) {
      vertCount = elements.buffer.byteLength;
      if (dtype === GL_UNSIGNED_SHORT$2) {
        vertCount >>= 1;
      } else if (dtype === GL_UNSIGNED_INT$2) {
        vertCount >>= 2;
      }
    }
    elements.vertCount = vertCount;

    // try to guess primitive type from cell dimension
    var primType = prim;
    if (prim < 0) {
      primType = GL_TRIANGLES;
      var dimension = elements.buffer.dimension;
      if (dimension === 1) primType = GL_POINTS;
      if (dimension === 2) primType = GL_LINES;
      if (dimension === 3) primType = GL_TRIANGLES;
    }
    elements.primType = primType;
  }

  function destroyElements (elements) {
    stats.elementsCount--;

    check$1(elements.buffer !== null, 'must not double destroy elements');
    delete elementSet[elements.id];
    elements.buffer.destroy();
    elements.buffer = null;
  }

  function createElements (options, persistent) {
    var buffer = bufferState.create(null, GL_ELEMENT_ARRAY_BUFFER, true);
    var elements = new REGLElementBuffer(buffer._buffer);
    stats.elementsCount++;

    function reglElements (options) {
      if (!options) {
        buffer();
        elements.primType = GL_TRIANGLES;
        elements.vertCount = 0;
        elements.type = GL_UNSIGNED_BYTE$3;
      } else if (typeof options === 'number') {
        buffer(options);
        elements.primType = GL_TRIANGLES;
        elements.vertCount = options | 0;
        elements.type = GL_UNSIGNED_BYTE$3;
      } else {
        var data = null;
        var usage = GL_STATIC_DRAW$1;
        var primType = -1;
        var vertCount = -1;
        var byteLength = 0;
        var dtype = 0;
        if (Array.isArray(options) ||
            isTypedArray(options) ||
            isNDArrayLike(options)) {
          data = options;
        } else {
          check$1.type(options, 'object', 'invalid arguments for elements');
          if ('data' in options) {
            data = options.data;
            check$1(
                Array.isArray(data) ||
                isTypedArray(data) ||
                isNDArrayLike(data),
                'invalid data for element buffer');
          }
          if ('usage' in options) {
            check$1.parameter(
              options.usage,
              usageTypes,
              'invalid element buffer usage');
            usage = usageTypes[options.usage];
          }
          if ('primitive' in options) {
            check$1.parameter(
              options.primitive,
              primTypes,
              'invalid element buffer primitive');
            primType = primTypes[options.primitive];
          }
          if ('count' in options) {
            check$1(
              typeof options.count === 'number' && options.count >= 0,
              'invalid vertex count for elements');
            vertCount = options.count | 0;
          }
          if ('type' in options) {
            check$1.parameter(
              options.type,
              elementTypes,
              'invalid buffer type');
            dtype = elementTypes[options.type];
          }
          if ('length' in options) {
            byteLength = options.length | 0;
          } else {
            byteLength = vertCount;
            if (dtype === GL_UNSIGNED_SHORT$2 || dtype === GL_SHORT$2) {
              byteLength *= 2;
            } else if (dtype === GL_UNSIGNED_INT$2 || dtype === GL_INT$2) {
              byteLength *= 4;
            }
          }
        }
        initElements(
          elements,
          data,
          usage,
          primType,
          vertCount,
          byteLength,
          dtype);
      }

      return reglElements
    }

    reglElements(options);

    reglElements._reglType = 'elements';
    reglElements._elements = elements;
    reglElements.subdata = function (data, offset) {
      buffer.subdata(data, offset);
      return reglElements
    };
    reglElements.destroy = function () {
      destroyElements(elements);
    };

    return reglElements
  }

  return {
    create: createElements,
    createStream: createElementStream,
    destroyStream: destroyElementStream,
    getElements: function (elements) {
      if (typeof elements === 'function' &&
          elements._elements instanceof REGLElementBuffer) {
        return elements._elements
      }
      return null
    },
    clear: function () {
      values(elementSet).forEach(destroyElements);
    }
  }
}

var FLOAT = new Float32Array(1);
var INT = new Uint32Array(FLOAT.buffer);

var GL_UNSIGNED_SHORT$4 = 5123;

function convertToHalfFloat (array) {
  var ushorts = pool.allocType(GL_UNSIGNED_SHORT$4, array.length);

  for (var i = 0; i < array.length; ++i) {
    if (isNaN(array[i])) {
      ushorts[i] = 0xffff;
    } else if (array[i] === Infinity) {
      ushorts[i] = 0x7c00;
    } else if (array[i] === -Infinity) {
      ushorts[i] = 0xfc00;
    } else {
      FLOAT[0] = array[i];
      var x = INT[0];

      var sgn = (x >>> 31) << 15;
      var exp = ((x << 1) >>> 24) - 127;
      var frac = (x >> 13) & ((1 << 10) - 1);

      if (exp < -24) {
        // round non-representable denormals to 0
        ushorts[i] = sgn;
      } else if (exp < -14) {
        // handle denormals
        var s = -14 - exp;
        ushorts[i] = sgn + ((frac + (1 << 10)) >> s);
      } else if (exp > 15) {
        // round overflow to +/- Infinity
        ushorts[i] = sgn + 0x7c00;
      } else {
        // otherwise convert directly
        ushorts[i] = sgn + ((exp + 15) << 10) + frac;
      }
    }
  }

  return ushorts
}

function isArrayLike (s) {
  return Array.isArray(s) || isTypedArray(s)
}

var GL_COMPRESSED_TEXTURE_FORMATS = 0x86A3;

var GL_TEXTURE_2D = 0x0DE1;
var GL_TEXTURE_CUBE_MAP = 0x8513;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;

var GL_RGBA = 0x1908;
var GL_ALPHA = 0x1906;
var GL_RGB = 0x1907;
var GL_LUMINANCE = 0x1909;
var GL_LUMINANCE_ALPHA = 0x190A;

var GL_RGBA4 = 0x8056;
var GL_RGB5_A1 = 0x8057;
var GL_RGB565 = 0x8D62;

var GL_UNSIGNED_SHORT_4_4_4_4$1 = 0x8033;
var GL_UNSIGNED_SHORT_5_5_5_1$1 = 0x8034;
var GL_UNSIGNED_SHORT_5_6_5$1 = 0x8363;
var GL_UNSIGNED_INT_24_8_WEBGL$1 = 0x84FA;

var GL_DEPTH_COMPONENT = 0x1902;
var GL_DEPTH_STENCIL = 0x84F9;

var GL_SRGB_EXT = 0x8C40;
var GL_SRGB_ALPHA_EXT = 0x8C42;

var GL_HALF_FLOAT_OES$1 = 0x8D61;

var GL_COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83F0;
var GL_COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83F1;
var GL_COMPRESSED_RGBA_S3TC_DXT3_EXT = 0x83F2;
var GL_COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

var GL_COMPRESSED_RGB_ATC_WEBGL = 0x8C92;
var GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 0x8C93;
var GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 0x87EE;

var GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
var GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
var GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
var GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

var GL_COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

var GL_UNSIGNED_BYTE$4 = 0x1401;
var GL_UNSIGNED_SHORT$3 = 0x1403;
var GL_UNSIGNED_INT$3 = 0x1405;
var GL_FLOAT$3 = 0x1406;

var GL_TEXTURE_WRAP_S = 0x2802;
var GL_TEXTURE_WRAP_T = 0x2803;

var GL_REPEAT = 0x2901;
var GL_CLAMP_TO_EDGE$1 = 0x812F;
var GL_MIRRORED_REPEAT = 0x8370;

var GL_TEXTURE_MAG_FILTER = 0x2800;
var GL_TEXTURE_MIN_FILTER = 0x2801;

var GL_NEAREST$1 = 0x2600;
var GL_LINEAR = 0x2601;
var GL_NEAREST_MIPMAP_NEAREST$1 = 0x2700;
var GL_LINEAR_MIPMAP_NEAREST$1 = 0x2701;
var GL_NEAREST_MIPMAP_LINEAR$1 = 0x2702;
var GL_LINEAR_MIPMAP_LINEAR$1 = 0x2703;

var GL_GENERATE_MIPMAP_HINT = 0x8192;
var GL_DONT_CARE = 0x1100;
var GL_FASTEST = 0x1101;
var GL_NICEST = 0x1102;

var GL_TEXTURE_MAX_ANISOTROPY_EXT = 0x84FE;

var GL_UNPACK_ALIGNMENT = 0x0CF5;
var GL_UNPACK_FLIP_Y_WEBGL = 0x9240;
var GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
var GL_UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;

var GL_BROWSER_DEFAULT_WEBGL = 0x9244;

var GL_TEXTURE0 = 0x84C0;

var MIPMAP_FILTERS = [
  GL_NEAREST_MIPMAP_NEAREST$1,
  GL_NEAREST_MIPMAP_LINEAR$1,
  GL_LINEAR_MIPMAP_NEAREST$1,
  GL_LINEAR_MIPMAP_LINEAR$1
];

var CHANNELS_FORMAT = [
  0,
  GL_LUMINANCE,
  GL_LUMINANCE_ALPHA,
  GL_RGB,
  GL_RGBA
];

var FORMAT_CHANNELS = {};
FORMAT_CHANNELS[GL_LUMINANCE] =
FORMAT_CHANNELS[GL_ALPHA] =
FORMAT_CHANNELS[GL_DEPTH_COMPONENT] = 1;
FORMAT_CHANNELS[GL_DEPTH_STENCIL] =
FORMAT_CHANNELS[GL_LUMINANCE_ALPHA] = 2;
FORMAT_CHANNELS[GL_RGB] =
FORMAT_CHANNELS[GL_SRGB_EXT] = 3;
FORMAT_CHANNELS[GL_RGBA] =
FORMAT_CHANNELS[GL_SRGB_ALPHA_EXT] = 4;

function objectName (str) {
  return '[object ' + str + ']'
}

var CANVAS_CLASS = objectName('HTMLCanvasElement');
var CONTEXT2D_CLASS = objectName('CanvasRenderingContext2D');
var IMAGE_CLASS = objectName('HTMLImageElement');
var VIDEO_CLASS = objectName('HTMLVideoElement');

var PIXEL_CLASSES = Object.keys(arrayTypes).concat([
  CANVAS_CLASS,
  CONTEXT2D_CLASS,
  IMAGE_CLASS,
  VIDEO_CLASS
]);

// for every texture type, store
// the size in bytes.
var TYPE_SIZES = [];
TYPE_SIZES[GL_UNSIGNED_BYTE$4] = 1;
TYPE_SIZES[GL_FLOAT$3] = 4;
TYPE_SIZES[GL_HALF_FLOAT_OES$1] = 2;

TYPE_SIZES[GL_UNSIGNED_SHORT$3] = 2;
TYPE_SIZES[GL_UNSIGNED_INT$3] = 4;

var FORMAT_SIZES_SPECIAL = [];
FORMAT_SIZES_SPECIAL[GL_RGBA4] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB5_A1] = 2;
FORMAT_SIZES_SPECIAL[GL_RGB565] = 2;
FORMAT_SIZES_SPECIAL[GL_DEPTH_STENCIL] = 4;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT1_EXT] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ATC_WEBGL] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = 0.25;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = 0.5;
FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = 0.25;

FORMAT_SIZES_SPECIAL[GL_COMPRESSED_RGB_ETC1_WEBGL] = 0.5;

function isNumericArray (arr) {
  return (
    Array.isArray(arr) &&
    (arr.length === 0 ||
    typeof arr[0] === 'number'))
}

function isRectArray (arr) {
  if (!Array.isArray(arr)) {
    return false
  }
  var width = arr.length;
  if (width === 0 || !isArrayLike(arr[0])) {
    return false
  }
  return true
}

function classString (x) {
  return Object.prototype.toString.call(x)
}

function isCanvasElement (object) {
  return classString(object) === CANVAS_CLASS
}

function isContext2D (object) {
  return classString(object) === CONTEXT2D_CLASS
}

function isImageElement (object) {
  return classString(object) === IMAGE_CLASS
}

function isVideoElement (object) {
  return classString(object) === VIDEO_CLASS
}

function isPixelData (object) {
  if (!object) {
    return false
  }
  var className = classString(object);
  if (PIXEL_CLASSES.indexOf(className) >= 0) {
    return true
  }
  return (
    isNumericArray(object) ||
    isRectArray(object) ||
    isNDArrayLike(object))
}

function typedArrayCode$1 (data) {
  return arrayTypes[Object.prototype.toString.call(data)] | 0
}

function convertData (result, data) {
  var n = data.length;
  switch (result.type) {
    case GL_UNSIGNED_BYTE$4:
    case GL_UNSIGNED_SHORT$3:
    case GL_UNSIGNED_INT$3:
    case GL_FLOAT$3:
      var converted = pool.allocType(result.type, n);
      converted.set(data);
      result.data = converted;
      break

    case GL_HALF_FLOAT_OES$1:
      result.data = convertToHalfFloat(data);
      break

    default:
      check$1.raise('unsupported texture type, must specify a typed array');
  }
}

function preConvert (image, n) {
  return pool.allocType(
    image.type === GL_HALF_FLOAT_OES$1
      ? GL_FLOAT$3
      : image.type, n)
}

function postConvert (image, data) {
  if (image.type === GL_HALF_FLOAT_OES$1) {
    image.data = convertToHalfFloat(data);
    pool.freeType(data);
  } else {
    image.data = data;
  }
}

function transposeData (image, array, strideX, strideY, strideC, offset) {
  var w = image.width;
  var h = image.height;
  var c = image.channels;
  var n = w * h * c;
  var data = preConvert(image, n);

  var p = 0;
  for (var i = 0; i < h; ++i) {
    for (var j = 0; j < w; ++j) {
      for (var k = 0; k < c; ++k) {
        data[p++] = array[strideX * j + strideY * i + strideC * k + offset];
      }
    }
  }

  postConvert(image, data);
}

function getTextureSize (format, type, width, height, isMipmap, isCube) {
  var s;
  if (typeof FORMAT_SIZES_SPECIAL[format] !== 'undefined') {
    // we have a special array for dealing with weird color formats such as RGB5A1
    s = FORMAT_SIZES_SPECIAL[format];
  } else {
    s = FORMAT_CHANNELS[format] * TYPE_SIZES[type];
  }

  if (isCube) {
    s *= 6;
  }

  if (isMipmap) {
    // compute the total size of all the mipmaps.
    var total = 0;

    var w = width;
    while (w >= 1) {
      // we can only use mipmaps on a square image,
      // so we can simply use the width and ignore the height:
      total += s * w * w;
      w /= 2;
    }
    return total
  } else {
    return s * width * height
  }
}

function createTextureSet (
  gl, extensions, limits, reglPoll, contextState, stats, config) {
  // -------------------------------------------------------
  // Initialize constants and parameter tables here
  // -------------------------------------------------------
  var mipmapHint = {
    "don't care": GL_DONT_CARE,
    'dont care': GL_DONT_CARE,
    'nice': GL_NICEST,
    'fast': GL_FASTEST
  };

  var wrapModes = {
    'repeat': GL_REPEAT,
    'clamp': GL_CLAMP_TO_EDGE$1,
    'mirror': GL_MIRRORED_REPEAT
  };

  var magFilters = {
    'nearest': GL_NEAREST$1,
    'linear': GL_LINEAR
  };

  var minFilters = extend({
    'mipmap': GL_LINEAR_MIPMAP_LINEAR$1,
    'nearest mipmap nearest': GL_NEAREST_MIPMAP_NEAREST$1,
    'linear mipmap nearest': GL_LINEAR_MIPMAP_NEAREST$1,
    'nearest mipmap linear': GL_NEAREST_MIPMAP_LINEAR$1,
    'linear mipmap linear': GL_LINEAR_MIPMAP_LINEAR$1
  }, magFilters);

  var colorSpace = {
    'none': 0,
    'browser': GL_BROWSER_DEFAULT_WEBGL
  };

  var textureTypes = {
    'uint8': GL_UNSIGNED_BYTE$4,
    'rgba4': GL_UNSIGNED_SHORT_4_4_4_4$1,
    'rgb565': GL_UNSIGNED_SHORT_5_6_5$1,
    'rgb5 a1': GL_UNSIGNED_SHORT_5_5_5_1$1
  };

  var textureFormats = {
    'alpha': GL_ALPHA,
    'luminance': GL_LUMINANCE,
    'luminance alpha': GL_LUMINANCE_ALPHA,
    'rgb': GL_RGB,
    'rgba': GL_RGBA,
    'rgba4': GL_RGBA4,
    'rgb5 a1': GL_RGB5_A1,
    'rgb565': GL_RGB565
  };

  var compressedTextureFormats = {};

  if (extensions.ext_srgb) {
    textureFormats.srgb = GL_SRGB_EXT;
    textureFormats.srgba = GL_SRGB_ALPHA_EXT;
  }

  if (extensions.oes_texture_float) {
    textureTypes.float32 = textureTypes.float = GL_FLOAT$3;
  }

  if (extensions.oes_texture_half_float) {
    textureTypes['float16'] = textureTypes['half float'] = GL_HALF_FLOAT_OES$1;
  }

  if (extensions.webgl_depth_texture) {
    extend(textureFormats, {
      'depth': GL_DEPTH_COMPONENT,
      'depth stencil': GL_DEPTH_STENCIL
    });

    extend(textureTypes, {
      'uint16': GL_UNSIGNED_SHORT$3,
      'uint32': GL_UNSIGNED_INT$3,
      'depth stencil': GL_UNSIGNED_INT_24_8_WEBGL$1
    });
  }

  if (extensions.webgl_compressed_texture_s3tc) {
    extend(compressedTextureFormats, {
      'rgb s3tc dxt1': GL_COMPRESSED_RGB_S3TC_DXT1_EXT,
      'rgba s3tc dxt1': GL_COMPRESSED_RGBA_S3TC_DXT1_EXT,
      'rgba s3tc dxt3': GL_COMPRESSED_RGBA_S3TC_DXT3_EXT,
      'rgba s3tc dxt5': GL_COMPRESSED_RGBA_S3TC_DXT5_EXT
    });
  }

  if (extensions.webgl_compressed_texture_atc) {
    extend(compressedTextureFormats, {
      'rgb atc': GL_COMPRESSED_RGB_ATC_WEBGL,
      'rgba atc explicit alpha': GL_COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
      'rgba atc interpolated alpha': GL_COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
    });
  }

  if (extensions.webgl_compressed_texture_pvrtc) {
    extend(compressedTextureFormats, {
      'rgb pvrtc 4bppv1': GL_COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
      'rgb pvrtc 2bppv1': GL_COMPRESSED_RGB_PVRTC_2BPPV1_IMG,
      'rgba pvrtc 4bppv1': GL_COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
      'rgba pvrtc 2bppv1': GL_COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
    });
  }

  if (extensions.webgl_compressed_texture_etc1) {
    compressedTextureFormats['rgb etc1'] = GL_COMPRESSED_RGB_ETC1_WEBGL;
  }

  // Copy over all texture formats
  var supportedCompressedFormats = Array.prototype.slice.call(
    gl.getParameter(GL_COMPRESSED_TEXTURE_FORMATS));
  Object.keys(compressedTextureFormats).forEach(function (name) {
    var format = compressedTextureFormats[name];
    if (supportedCompressedFormats.indexOf(format) >= 0) {
      textureFormats[name] = format;
    }
  });

  var supportedFormats = Object.keys(textureFormats);
  limits.textureFormats = supportedFormats;

  // associate with every format string its
  // corresponding GL-value.
  var textureFormatsInvert = [];
  Object.keys(textureFormats).forEach(function (key) {
    var val = textureFormats[key];
    textureFormatsInvert[val] = key;
  });

  // associate with every type string its
  // corresponding GL-value.
  var textureTypesInvert = [];
  Object.keys(textureTypes).forEach(function (key) {
    var val = textureTypes[key];
    textureTypesInvert[val] = key;
  });

  var magFiltersInvert = [];
  Object.keys(magFilters).forEach(function (key) {
    var val = magFilters[key];
    magFiltersInvert[val] = key;
  });

  var minFiltersInvert = [];
  Object.keys(minFilters).forEach(function (key) {
    var val = minFilters[key];
    minFiltersInvert[val] = key;
  });

  var wrapModesInvert = [];
  Object.keys(wrapModes).forEach(function (key) {
    var val = wrapModes[key];
    wrapModesInvert[val] = key;
  });

  // colorFormats[] gives the format (channels) associated to an
  // internalformat
  var colorFormats = supportedFormats.reduce(function (color, key) {
    var glenum = textureFormats[key];
    if (glenum === GL_LUMINANCE ||
        glenum === GL_ALPHA ||
        glenum === GL_LUMINANCE ||
        glenum === GL_LUMINANCE_ALPHA ||
        glenum === GL_DEPTH_COMPONENT ||
        glenum === GL_DEPTH_STENCIL) {
      color[glenum] = glenum;
    } else if (glenum === GL_RGB5_A1 || key.indexOf('rgba') >= 0) {
      color[glenum] = GL_RGBA;
    } else {
      color[glenum] = GL_RGB;
    }
    return color
  }, {});

  function TexFlags () {
    // format info
    this.internalformat = GL_RGBA;
    this.format = GL_RGBA;
    this.type = GL_UNSIGNED_BYTE$4;
    this.compressed = false;

    // pixel storage
    this.premultiplyAlpha = false;
    this.flipY = false;
    this.unpackAlignment = 1;
    this.colorSpace = 0;

    // shape info
    this.width = 0;
    this.height = 0;
    this.channels = 0;
  }

  function copyFlags (result, other) {
    result.internalformat = other.internalformat;
    result.format = other.format;
    result.type = other.type;
    result.compressed = other.compressed;

    result.premultiplyAlpha = other.premultiplyAlpha;
    result.flipY = other.flipY;
    result.unpackAlignment = other.unpackAlignment;
    result.colorSpace = other.colorSpace;

    result.width = other.width;
    result.height = other.height;
    result.channels = other.channels;
  }

  function parseFlags (flags, options) {
    if (typeof options !== 'object' || !options) {
      return
    }

    if ('premultiplyAlpha' in options) {
      check$1.type(options.premultiplyAlpha, 'boolean',
        'invalid premultiplyAlpha');
      flags.premultiplyAlpha = options.premultiplyAlpha;
    }

    if ('flipY' in options) {
      check$1.type(options.flipY, 'boolean',
        'invalid texture flip');
      flags.flipY = options.flipY;
    }

    if ('alignment' in options) {
      check$1.oneOf(options.alignment, [1, 2, 4, 8],
        'invalid texture unpack alignment');
      flags.unpackAlignment = options.alignment;
    }

    if ('colorSpace' in options) {
      check$1.parameter(options.colorSpace, colorSpace,
        'invalid colorSpace');
      flags.colorSpace = colorSpace[options.colorSpace];
    }

    if ('type' in options) {
      var type = options.type;
      check$1(extensions.oes_texture_float ||
        !(type === 'float' || type === 'float32'),
        'you must enable the OES_texture_float extension in order to use floating point textures.');
      check$1(extensions.oes_texture_half_float ||
        !(type === 'half float' || type === 'float16'),
        'you must enable the OES_texture_half_float extension in order to use 16-bit floating point textures.');
      check$1(extensions.webgl_depth_texture ||
        !(type === 'uint16' || type === 'uint32' || type === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(type, textureTypes,
        'invalid texture type');
      flags.type = textureTypes[type];
    }

    var w = flags.width;
    var h = flags.height;
    var c = flags.channels;
    var hasChannels = false;
    if ('shape' in options) {
      check$1(Array.isArray(options.shape) && options.shape.length >= 2,
        'shape must be an array');
      w = options.shape[0];
      h = options.shape[1];
      if (options.shape.length === 3) {
        c = options.shape[2];
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
      check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
    } else {
      if ('radius' in options) {
        w = h = options.radius;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid radius');
      }
      if ('width' in options) {
        w = options.width;
        check$1(w >= 0 && w <= limits.maxTextureSize, 'invalid width');
      }
      if ('height' in options) {
        h = options.height;
        check$1(h >= 0 && h <= limits.maxTextureSize, 'invalid height');
      }
      if ('channels' in options) {
        c = options.channels;
        check$1(c > 0 && c <= 4, 'invalid number of channels');
        hasChannels = true;
      }
    }
    flags.width = w | 0;
    flags.height = h | 0;
    flags.channels = c | 0;

    var hasFormat = false;
    if ('format' in options) {
      var formatStr = options.format;
      check$1(extensions.webgl_depth_texture ||
        !(formatStr === 'depth' || formatStr === 'depth stencil'),
        'you must enable the WEBGL_depth_texture extension in order to use depth/stencil textures.');
      check$1.parameter(formatStr, textureFormats,
        'invalid texture format');
      var internalformat = flags.internalformat = textureFormats[formatStr];
      flags.format = colorFormats[internalformat];
      if (formatStr in textureTypes) {
        if (!('type' in options)) {
          flags.type = textureTypes[formatStr];
        }
      }
      if (formatStr in compressedTextureFormats) {
        flags.compressed = true;
      }
      hasFormat = true;
    }

    // Reconcile channels and format
    if (!hasChannels && hasFormat) {
      flags.channels = FORMAT_CHANNELS[flags.format];
    } else if (hasChannels && !hasFormat) {
      if (flags.channels !== CHANNELS_FORMAT[flags.format]) {
        flags.format = flags.internalformat = CHANNELS_FORMAT[flags.channels];
      }
    } else if (hasFormat && hasChannels) {
      check$1(
        flags.channels === FORMAT_CHANNELS[flags.format],
        'number of channels inconsistent with specified format');
    }
  }

  function setFlags (flags) {
    gl.pixelStorei(GL_UNPACK_FLIP_Y_WEBGL, flags.flipY);
    gl.pixelStorei(GL_UNPACK_PREMULTIPLY_ALPHA_WEBGL, flags.premultiplyAlpha);
    gl.pixelStorei(GL_UNPACK_COLORSPACE_CONVERSION_WEBGL, flags.colorSpace);
    gl.pixelStorei(GL_UNPACK_ALIGNMENT, flags.unpackAlignment);
  }

  // -------------------------------------------------------
  // Tex image data
  // -------------------------------------------------------
  function TexImage () {
    TexFlags.call(this);

    this.xOffset = 0;
    this.yOffset = 0;

    // data
    this.data = null;
    this.needsFree = false;

    // html element
    this.element = null;

    // copyTexImage info
    this.needsCopy = false;
  }

  function parseImage (image, options) {
    var data = null;
    if (isPixelData(options)) {
      data = options;
    } else if (options) {
      check$1.type(options, 'object', 'invalid pixel data type');
      parseFlags(image, options);
      if ('x' in options) {
        image.xOffset = options.x | 0;
      }
      if ('y' in options) {
        image.yOffset = options.y | 0;
      }
      if (isPixelData(options.data)) {
        data = options.data;
      }
    }

    check$1(
      !image.compressed ||
      data instanceof Uint8Array,
      'compressed texture data must be stored in a uint8array');

    if (options.copy) {
      check$1(!data, 'can not specify copy and data field for the same texture');
      var viewW = contextState.viewportWidth;
      var viewH = contextState.viewportHeight;
      image.width = image.width || (viewW - image.xOffset);
      image.height = image.height || (viewH - image.yOffset);
      image.needsCopy = true;
      check$1(image.xOffset >= 0 && image.xOffset < viewW &&
            image.yOffset >= 0 && image.yOffset < viewH &&
            image.width > 0 && image.width <= viewW &&
            image.height > 0 && image.height <= viewH,
            'copy texture read out of bounds');
    } else if (!data) {
      image.width = image.width || 1;
      image.height = image.height || 1;
      image.channels = image.channels || 4;
    } else if (isTypedArray(data)) {
      image.channels = image.channels || 4;
      image.data = data;
      if (!('type' in options) && image.type === GL_UNSIGNED_BYTE$4) {
        image.type = typedArrayCode$1(data);
      }
    } else if (isNumericArray(data)) {
      image.channels = image.channels || 4;
      convertData(image, data);
      image.alignment = 1;
      image.needsFree = true;
    } else if (isNDArrayLike(data)) {
      var array = data.data;
      if (!Array.isArray(array) && image.type === GL_UNSIGNED_BYTE$4) {
        image.type = typedArrayCode$1(array);
      }
      var shape = data.shape;
      var stride = data.stride;
      var shapeX, shapeY, shapeC, strideX, strideY, strideC;
      if (shape.length === 3) {
        shapeC = shape[2];
        strideC = stride[2];
      } else {
        check$1(shape.length === 2, 'invalid ndarray pixel data, must be 2 or 3D');
        shapeC = 1;
        strideC = 1;
      }
      shapeX = shape[0];
      shapeY = shape[1];
      strideX = stride[0];
      strideY = stride[1];
      image.alignment = 1;
      image.width = shapeX;
      image.height = shapeY;
      image.channels = shapeC;
      image.format = image.internalformat = CHANNELS_FORMAT[shapeC];
      image.needsFree = true;
      transposeData(image, array, strideX, strideY, strideC, data.offset);
    } else if (isCanvasElement(data) || isContext2D(data)) {
      if (isCanvasElement(data)) {
        image.element = data;
      } else {
        image.element = data.canvas;
      }
      image.width = image.element.width;
      image.height = image.element.height;
      image.channels = 4;
    } else if (isImageElement(data)) {
      image.element = data;
      image.width = data.naturalWidth;
      image.height = data.naturalHeight;
      image.channels = 4;
    } else if (isVideoElement(data)) {
      image.element = data;
      image.width = data.videoWidth;
      image.height = data.videoHeight;
      image.channels = 4;
    } else if (isRectArray(data)) {
      var w = image.width || data[0].length;
      var h = image.height || data.length;
      var c = image.channels;
      if (isArrayLike(data[0][0])) {
        c = c || data[0][0].length;
      } else {
        c = c || 1;
      }
      var arrayShape = flattenUtils.shape(data);
      var n = 1;
      for (var dd = 0; dd < arrayShape.length; ++dd) {
        n *= arrayShape[dd];
      }
      var allocData = preConvert(image, n);
      flattenUtils.flatten(data, arrayShape, '', allocData);
      postConvert(image, allocData);
      image.alignment = 1;
      image.width = w;
      image.height = h;
      image.channels = c;
      image.format = image.internalformat = CHANNELS_FORMAT[c];
      image.needsFree = true;
    }

    if (image.type === GL_FLOAT$3) {
      check$1(limits.extensions.indexOf('oes_texture_float') >= 0,
        'oes_texture_float extension not enabled');
    } else if (image.type === GL_HALF_FLOAT_OES$1) {
      check$1(limits.extensions.indexOf('oes_texture_half_float') >= 0,
        'oes_texture_half_float extension not enabled');
    }

    // do compressed texture  validation here.
  }

  function setImage (info, target, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;

    setFlags(info);

    if (element) {
      gl.texImage2D(target, miplevel, format, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexImage2D(target, miplevel, internalformat, width, height, 0, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexImage2D(
        target, miplevel, format, info.xOffset, info.yOffset, width, height, 0);
    } else {
      gl.texImage2D(
        target, miplevel, format, width, height, 0, format, type, data);
    }
  }

  function setSubImage (info, target, x, y, miplevel) {
    var element = info.element;
    var data = info.data;
    var internalformat = info.internalformat;
    var format = info.format;
    var type = info.type;
    var width = info.width;
    var height = info.height;

    setFlags(info);

    if (element) {
      gl.texSubImage2D(
        target, miplevel, x, y, format, type, element);
    } else if (info.compressed) {
      gl.compressedTexSubImage2D(
        target, miplevel, x, y, internalformat, width, height, data);
    } else if (info.needsCopy) {
      reglPoll();
      gl.copyTexSubImage2D(
        target, miplevel, x, y, info.xOffset, info.yOffset, width, height);
    } else {
      gl.texSubImage2D(
        target, miplevel, x, y, width, height, format, type, data);
    }
  }

  // texImage pool
  var imagePool = [];

  function allocImage () {
    return imagePool.pop() || new TexImage()
  }

  function freeImage (image) {
    if (image.needsFree) {
      pool.freeType(image.data);
    }
    TexImage.call(image);
    imagePool.push(image);
  }

  // -------------------------------------------------------
  // Mip map
  // -------------------------------------------------------
  function MipMap () {
    TexFlags.call(this);

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
    this.mipmask = 0;
    this.images = Array(16);
  }

  function parseMipMapFromShape (mipmap, width, height) {
    var img = mipmap.images[0] = allocImage();
    mipmap.mipmask = 1;
    img.width = mipmap.width = width;
    img.height = mipmap.height = height;
    img.channels = mipmap.channels = 4;
  }

  function parseMipMapFromObject (mipmap, options) {
    var imgData = null;
    if (isPixelData(options)) {
      imgData = mipmap.images[0] = allocImage();
      copyFlags(imgData, mipmap);
      parseImage(imgData, options);
      mipmap.mipmask = 1;
    } else {
      parseFlags(mipmap, options);
      if (Array.isArray(options.mipmap)) {
        var mipData = options.mipmap;
        for (var i = 0; i < mipData.length; ++i) {
          imgData = mipmap.images[i] = allocImage();
          copyFlags(imgData, mipmap);
          imgData.width >>= i;
          imgData.height >>= i;
          parseImage(imgData, mipData[i]);
          mipmap.mipmask |= (1 << i);
        }
      } else {
        imgData = mipmap.images[0] = allocImage();
        copyFlags(imgData, mipmap);
        parseImage(imgData, options);
        mipmap.mipmask = 1;
      }
    }
    copyFlags(mipmap, mipmap.images[0]);

    // For textures of the compressed format WEBGL_compressed_texture_s3tc
    // we must have that
    //
    // "When level equals zero width and height must be a multiple of 4.
    // When level is greater than 0 width and height must be 0, 1, 2 or a multiple of 4. "
    //
    // but we do not yet support having multiple mipmap levels for compressed textures,
    // so we only test for level zero.

    if (mipmap.compressed &&
        (mipmap.internalformat === GL_COMPRESSED_RGB_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT1_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT3_EXT) ||
        (mipmap.internalformat === GL_COMPRESSED_RGBA_S3TC_DXT5_EXT)) {
      check$1(mipmap.width % 4 === 0 &&
            mipmap.height % 4 === 0,
            'for compressed texture formats, mipmap level 0 must have width and height that are a multiple of 4');
    }
  }

  function setMipMap (mipmap, target) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (!images[i]) {
        return
      }
      setImage(images[i], target, i);
    }
  }

  var mipPool = [];

  function allocMipMap () {
    var result = mipPool.pop() || new MipMap();
    TexFlags.call(result);
    result.mipmask = 0;
    for (var i = 0; i < 16; ++i) {
      result.images[i] = null;
    }
    return result
  }

  function freeMipMap (mipmap) {
    var images = mipmap.images;
    for (var i = 0; i < images.length; ++i) {
      if (images[i]) {
        freeImage(images[i]);
      }
      images[i] = null;
    }
    mipPool.push(mipmap);
  }

  // -------------------------------------------------------
  // Tex info
  // -------------------------------------------------------
  function TexInfo () {
    this.minFilter = GL_NEAREST$1;
    this.magFilter = GL_NEAREST$1;

    this.wrapS = GL_CLAMP_TO_EDGE$1;
    this.wrapT = GL_CLAMP_TO_EDGE$1;

    this.anisotropic = 1;

    this.genMipmaps = false;
    this.mipmapHint = GL_DONT_CARE;
  }

  function parseTexInfo (info, options) {
    if ('min' in options) {
      var minFilter = options.min;
      check$1.parameter(minFilter, minFilters);
      info.minFilter = minFilters[minFilter];
      if (MIPMAP_FILTERS.indexOf(info.minFilter) >= 0) {
        info.genMipmaps = true;
      }
    }

    if ('mag' in options) {
      var magFilter = options.mag;
      check$1.parameter(magFilter, magFilters);
      info.magFilter = magFilters[magFilter];
    }

    var wrapS = info.wrapS;
    var wrapT = info.wrapT;
    if ('wrap' in options) {
      var wrap = options.wrap;
      if (typeof wrap === 'string') {
        check$1.parameter(wrap, wrapModes);
        wrapS = wrapT = wrapModes[wrap];
      } else if (Array.isArray(wrap)) {
        check$1.parameter(wrap[0], wrapModes);
        check$1.parameter(wrap[1], wrapModes);
        wrapS = wrapModes[wrap[0]];
        wrapT = wrapModes[wrap[1]];
      }
    } else {
      if ('wrapS' in options) {
        var optWrapS = options.wrapS;
        check$1.parameter(optWrapS, wrapModes);
        wrapS = wrapModes[optWrapS];
      }
      if ('wrapT' in options) {
        var optWrapT = options.wrapT;
        check$1.parameter(optWrapT, wrapModes);
        wrapT = wrapModes[optWrapT];
      }
    }
    info.wrapS = wrapS;
    info.wrapT = wrapT;

    if ('anisotropic' in options) {
      var anisotropic = options.anisotropic;
      check$1(typeof anisotropic === 'number' &&
         anisotropic >= 1 && anisotropic <= limits.maxAnisotropic,
        'aniso samples must be between 1 and ');
      info.anisotropic = options.anisotropic;
    }

    if ('mipmap' in options) {
      var hasMipMap = false;
      switch (typeof options.mipmap) {
        case 'string':
          check$1.parameter(options.mipmap, mipmapHint,
            'invalid mipmap hint');
          info.mipmapHint = mipmapHint[options.mipmap];
          info.genMipmaps = true;
          hasMipMap = true;
          break

        case 'boolean':
          hasMipMap = info.genMipmaps = options.mipmap;
          break

        case 'object':
          check$1(Array.isArray(options.mipmap), 'invalid mipmap type');
          info.genMipmaps = false;
          hasMipMap = true;
          break

        default:
          check$1.raise('invalid mipmap type');
      }
      if (hasMipMap && !('min' in options)) {
        info.minFilter = GL_NEAREST_MIPMAP_NEAREST$1;
      }
    }
  }

  function setTexInfo (info, target) {
    gl.texParameteri(target, GL_TEXTURE_MIN_FILTER, info.minFilter);
    gl.texParameteri(target, GL_TEXTURE_MAG_FILTER, info.magFilter);
    gl.texParameteri(target, GL_TEXTURE_WRAP_S, info.wrapS);
    gl.texParameteri(target, GL_TEXTURE_WRAP_T, info.wrapT);
    if (extensions.ext_texture_filter_anisotropic) {
      gl.texParameteri(target, GL_TEXTURE_MAX_ANISOTROPY_EXT, info.anisotropic);
    }
    if (info.genMipmaps) {
      gl.hint(GL_GENERATE_MIPMAP_HINT, info.mipmapHint);
      gl.generateMipmap(target);
    }
  }

  // -------------------------------------------------------
  // Full texture object
  // -------------------------------------------------------
  var textureCount = 0;
  var textureSet = {};
  var numTexUnits = limits.maxTextureUnits;
  var textureUnits = Array(numTexUnits).map(function () {
    return null
  });

  function REGLTexture (target) {
    TexFlags.call(this);
    this.mipmask = 0;
    this.internalformat = GL_RGBA;

    this.id = textureCount++;

    this.refCount = 1;

    this.target = target;
    this.texture = gl.createTexture();

    this.unit = -1;
    this.bindCount = 0;

    this.texInfo = new TexInfo();

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  function tempBind (texture) {
    gl.activeTexture(GL_TEXTURE0);
    gl.bindTexture(texture.target, texture.texture);
  }

  function tempRestore () {
    var prev = textureUnits[0];
    if (prev) {
      gl.bindTexture(prev.target, prev.texture);
    } else {
      gl.bindTexture(GL_TEXTURE_2D, null);
    }
  }

  function destroy (texture) {
    var handle = texture.texture;
    check$1(handle, 'must not double destroy texture');
    var unit = texture.unit;
    var target = texture.target;
    if (unit >= 0) {
      gl.activeTexture(GL_TEXTURE0 + unit);
      gl.bindTexture(target, null);
      textureUnits[unit] = null;
    }
    gl.deleteTexture(handle);
    texture.texture = null;
    texture.params = null;
    texture.pixels = null;
    texture.refCount = 0;
    delete textureSet[texture.id];
    stats.textureCount--;
  }

  extend(REGLTexture.prototype, {
    bind: function () {
      var texture = this;
      texture.bindCount += 1;
      var unit = texture.unit;
      if (unit < 0) {
        for (var i = 0; i < numTexUnits; ++i) {
          var other = textureUnits[i];
          if (other) {
            if (other.bindCount > 0) {
              continue
            }
            other.unit = -1;
          }
          textureUnits[i] = texture;
          unit = i;
          break
        }
        if (unit >= numTexUnits) {
          check$1.raise('insufficient number of texture units');
        }
        if (config.profile && stats.maxTextureUnits < (unit + 1)) {
          stats.maxTextureUnits = unit + 1; // +1, since the units are zero-based
        }
        texture.unit = unit;
        gl.activeTexture(GL_TEXTURE0 + unit);
        gl.bindTexture(texture.target, texture.texture);
      }
      return unit
    },

    unbind: function () {
      this.bindCount -= 1;
    },

    decRef: function () {
      if (--this.refCount <= 0) {
        destroy(this);
      }
    }
  });

  function createTexture2D (a, b) {
    var texture = new REGLTexture(GL_TEXTURE_2D);
    textureSet[texture.id] = texture;
    stats.textureCount++;

    function reglTexture2D (a, b) {
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      var mipData = allocMipMap();

      if (typeof a === 'number') {
        if (typeof b === 'number') {
          parseMipMapFromShape(mipData, a | 0, b | 0);
        } else {
          parseMipMapFromShape(mipData, a | 0, a | 0);
        }
      } else if (a) {
        check$1.type(a, 'object', 'invalid arguments to regl.texture');
        parseTexInfo(texInfo, a);
        parseMipMapFromObject(mipData, a);
      } else {
        // empty textures get assigned a default shape of 1x1
        parseMipMapFromShape(mipData, 1, 1);
      }

      if (texInfo.genMipmaps) {
        mipData.mipmask = (mipData.width << 1) - 1;
      }
      texture.mipmask = mipData.mipmask;

      copyFlags(texture, mipData);

      check$1.texture2D(texInfo, mipData, limits);
      texture.internalformat = mipData.internalformat;

      reglTexture2D.width = mipData.width;
      reglTexture2D.height = mipData.height;

      tempBind(texture);
      setMipMap(mipData, GL_TEXTURE_2D);
      setTexInfo(texInfo, GL_TEXTURE_2D);
      tempRestore();

      freeMipMap(mipData);

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          mipData.width,
          mipData.height,
          texInfo.genMipmaps,
          false);
      }
      reglTexture2D.format = textureFormatsInvert[texture.internalformat];
      reglTexture2D.type = textureTypesInvert[texture.type];

      reglTexture2D.mag = magFiltersInvert[texInfo.magFilter];
      reglTexture2D.min = minFiltersInvert[texInfo.minFilter];

      reglTexture2D.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTexture2D.wrapT = wrapModesInvert[texInfo.wrapT];

      return reglTexture2D
    }

    function subimage (image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_2D, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTexture2D
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;
      if (w === texture.width && h === texture.height) {
        return reglTexture2D
      }

      reglTexture2D.width = texture.width = w;
      reglTexture2D.height = texture.height = h;

      tempBind(texture);
      for (var i = 0; texture.mipmask >> i; ++i) {
        gl.texImage2D(
          GL_TEXTURE_2D,
          i,
          texture.format,
          w >> i,
          h >> i,
          0,
          texture.format,
          texture.type,
          null);
      }
      tempRestore();

      // also, recompute the texture size.
      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          w,
          h,
          false,
          false);
      }

      return reglTexture2D
    }

    reglTexture2D(a, b);

    reglTexture2D.subimage = subimage;
    reglTexture2D.resize = resize;
    reglTexture2D._reglType = 'texture2d';
    reglTexture2D._texture = texture;
    if (config.profile) {
      reglTexture2D.stats = texture.stats;
    }
    reglTexture2D.destroy = function () {
      texture.decRef();
    };

    return reglTexture2D
  }

  function createTextureCube (a0, a1, a2, a3, a4, a5) {
    var texture = new REGLTexture(GL_TEXTURE_CUBE_MAP);
    textureSet[texture.id] = texture;
    stats.cubeCount++;

    var faces = new Array(6);

    function reglTextureCube (a0, a1, a2, a3, a4, a5) {
      var i;
      var texInfo = texture.texInfo;
      TexInfo.call(texInfo);
      for (i = 0; i < 6; ++i) {
        faces[i] = allocMipMap();
      }

      if (typeof a0 === 'number' || !a0) {
        var s = (a0 | 0) || 1;
        for (i = 0; i < 6; ++i) {
          parseMipMapFromShape(faces[i], s, s);
        }
      } else if (typeof a0 === 'object') {
        if (a1) {
          parseMipMapFromObject(faces[0], a0);
          parseMipMapFromObject(faces[1], a1);
          parseMipMapFromObject(faces[2], a2);
          parseMipMapFromObject(faces[3], a3);
          parseMipMapFromObject(faces[4], a4);
          parseMipMapFromObject(faces[5], a5);
        } else {
          parseTexInfo(texInfo, a0);
          parseFlags(texture, a0);
          if ('faces' in a0) {
            var face_input = a0.faces;
            check$1(Array.isArray(face_input) && face_input.length === 6,
              'cube faces must be a length 6 array');
            for (i = 0; i < 6; ++i) {
              check$1(typeof face_input[i] === 'object' && !!face_input[i],
                'invalid input for cube map face');
              copyFlags(faces[i], texture);
              parseMipMapFromObject(faces[i], face_input[i]);
            }
          } else {
            for (i = 0; i < 6; ++i) {
              parseMipMapFromObject(faces[i], a0);
            }
          }
        }
      } else {
        check$1.raise('invalid arguments to cube map');
      }

      copyFlags(texture, faces[0]);
      if (texInfo.genMipmaps) {
        texture.mipmask = (faces[0].width << 1) - 1;
      } else {
        texture.mipmask = faces[0].mipmask;
      }

      check$1.textureCube(texture, texInfo, faces, limits);
      texture.internalformat = faces[0].internalformat;

      reglTextureCube.width = faces[0].width;
      reglTextureCube.height = faces[0].height;

      tempBind(texture);
      for (i = 0; i < 6; ++i) {
        setMipMap(faces[i], GL_TEXTURE_CUBE_MAP_POSITIVE_X + i);
      }
      setTexInfo(texInfo, GL_TEXTURE_CUBE_MAP);
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          texInfo.genMipmaps,
          true);
      }

      reglTextureCube.format = textureFormatsInvert[texture.internalformat];
      reglTextureCube.type = textureTypesInvert[texture.type];

      reglTextureCube.mag = magFiltersInvert[texInfo.magFilter];
      reglTextureCube.min = minFiltersInvert[texInfo.minFilter];

      reglTextureCube.wrapS = wrapModesInvert[texInfo.wrapS];
      reglTextureCube.wrapT = wrapModesInvert[texInfo.wrapT];

      for (i = 0; i < 6; ++i) {
        freeMipMap(faces[i]);
      }

      return reglTextureCube
    }

    function subimage (face, image, x_, y_, level_) {
      check$1(!!image, 'must specify image data');
      check$1(typeof face === 'number' && face === (face | 0) &&
        face >= 0 && face < 6, 'invalid face');

      var x = x_ | 0;
      var y = y_ | 0;
      var level = level_ | 0;

      var imageData = allocImage();
      copyFlags(imageData, texture);
      imageData.width = 0;
      imageData.height = 0;
      parseImage(imageData, image);
      imageData.width = imageData.width || ((texture.width >> level) - x);
      imageData.height = imageData.height || ((texture.height >> level) - y);

      check$1(
        texture.type === imageData.type &&
        texture.format === imageData.format &&
        texture.internalformat === imageData.internalformat,
        'incompatible format for texture.subimage');
      check$1(
        x >= 0 && y >= 0 &&
        x + imageData.width <= texture.width &&
        y + imageData.height <= texture.height,
        'texture.subimage write out of bounds');
      check$1(
        texture.mipmask & (1 << level),
        'missing mipmap data');
      check$1(
        imageData.data || imageData.element || imageData.needsCopy,
        'missing image data');

      tempBind(texture);
      setSubImage(imageData, GL_TEXTURE_CUBE_MAP_POSITIVE_X + face, x, y, level);
      tempRestore();

      freeImage(imageData);

      return reglTextureCube
    }

    function resize (radius_) {
      var radius = radius_ | 0;
      if (radius === texture.width) {
        return
      }

      reglTextureCube.width = texture.width = radius;
      reglTextureCube.height = texture.height = radius;

      tempBind(texture);
      for (var i = 0; i < 6; ++i) {
        for (var j = 0; texture.mipmask >> j; ++j) {
          gl.texImage2D(
            GL_TEXTURE_CUBE_MAP_POSITIVE_X + i,
            j,
            texture.format,
            radius >> j,
            radius >> j,
            0,
            texture.format,
            texture.type,
            null);
        }
      }
      tempRestore();

      if (config.profile) {
        texture.stats.size = getTextureSize(
          texture.internalformat,
          texture.type,
          reglTextureCube.width,
          reglTextureCube.height,
          false,
          true);
      }

      return reglTextureCube
    }

    reglTextureCube(a0, a1, a2, a3, a4, a5);

    reglTextureCube.subimage = subimage;
    reglTextureCube.resize = resize;
    reglTextureCube._reglType = 'textureCube';
    reglTextureCube._texture = texture;
    if (config.profile) {
      reglTextureCube.stats = texture.stats;
    }
    reglTextureCube.destroy = function () {
      texture.decRef();
    };

    return reglTextureCube
  }

  // Called when regl is destroyed
  function destroyTextures () {
    for (var i = 0; i < numTexUnits; ++i) {
      gl.activeTexture(GL_TEXTURE0 + i);
      gl.bindTexture(GL_TEXTURE_2D, null);
      textureUnits[i] = null;
    }
    values(textureSet).forEach(destroy);

    stats.cubeCount = 0;
    stats.textureCount = 0;
  }

  if (config.profile) {
    stats.getTotalTextureSize = function () {
      var total = 0;
      Object.keys(textureSet).forEach(function (key) {
        total += textureSet[key].stats.size;
      });
      return total
    };
  }

  function restoreTextures () {
    values(textureSet).forEach(function (texture) {
      texture.texture = gl.createTexture();
      gl.bindTexture(texture.target, texture.texture);
      for (var i = 0; i < 32; ++i) {
        if ((texture.mipmask & (1 << i)) === 0) {
          continue
        }
        if (texture.target === GL_TEXTURE_2D) {
          gl.texImage2D(GL_TEXTURE_2D,
            i,
            texture.internalformat,
            texture.width >> i,
            texture.height >> i,
            0,
            texture.internalformat,
            texture.type,
            null);
        } else {
          for (var j = 0; j < 6; ++j) {
            gl.texImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X + j,
              i,
              texture.internalformat,
              texture.width >> i,
              texture.height >> i,
              0,
              texture.internalformat,
              texture.type,
              null);
          }
        }
      }
      setTexInfo(texture.texInfo, texture.target);
    });
  }

  return {
    create2D: createTexture2D,
    createCube: createTextureCube,
    clear: destroyTextures,
    getTexture: function (wrapper) {
      return null
    },
    restore: restoreTextures
  }
}

var GL_RENDERBUFFER = 0x8D41;

var GL_RGBA4$1 = 0x8056;
var GL_RGB5_A1$1 = 0x8057;
var GL_RGB565$1 = 0x8D62;
var GL_DEPTH_COMPONENT16 = 0x81A5;
var GL_STENCIL_INDEX8 = 0x8D48;
var GL_DEPTH_STENCIL$1 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT = 0x8C43;

var GL_RGBA32F_EXT = 0x8814;

var GL_RGBA16F_EXT = 0x881A;
var GL_RGB16F_EXT = 0x881B;

var FORMAT_SIZES = [];

FORMAT_SIZES[GL_RGBA4$1] = 2;
FORMAT_SIZES[GL_RGB5_A1$1] = 2;
FORMAT_SIZES[GL_RGB565$1] = 2;

FORMAT_SIZES[GL_DEPTH_COMPONENT16] = 2;
FORMAT_SIZES[GL_STENCIL_INDEX8] = 1;
FORMAT_SIZES[GL_DEPTH_STENCIL$1] = 4;

FORMAT_SIZES[GL_SRGB8_ALPHA8_EXT] = 4;
FORMAT_SIZES[GL_RGBA32F_EXT] = 16;
FORMAT_SIZES[GL_RGBA16F_EXT] = 8;
FORMAT_SIZES[GL_RGB16F_EXT] = 6;

function getRenderbufferSize (format, width, height) {
  return FORMAT_SIZES[format] * width * height
}

var wrapRenderbuffers = function (gl, extensions, limits, stats, config) {
  var formatTypes = {
    'rgba4': GL_RGBA4$1,
    'rgb565': GL_RGB565$1,
    'rgb5 a1': GL_RGB5_A1$1,
    'depth': GL_DEPTH_COMPONENT16,
    'stencil': GL_STENCIL_INDEX8,
    'depth stencil': GL_DEPTH_STENCIL$1
  };

  if (extensions.ext_srgb) {
    formatTypes['srgba'] = GL_SRGB8_ALPHA8_EXT;
  }

  if (extensions.ext_color_buffer_half_float) {
    formatTypes['rgba16f'] = GL_RGBA16F_EXT;
    formatTypes['rgb16f'] = GL_RGB16F_EXT;
  }

  if (extensions.webgl_color_buffer_float) {
    formatTypes['rgba32f'] = GL_RGBA32F_EXT;
  }

  var formatTypesInvert = [];
  Object.keys(formatTypes).forEach(function (key) {
    var val = formatTypes[key];
    formatTypesInvert[val] = key;
  });

  var renderbufferCount = 0;
  var renderbufferSet = {};

  function REGLRenderbuffer (renderbuffer) {
    this.id = renderbufferCount++;
    this.refCount = 1;

    this.renderbuffer = renderbuffer;

    this.format = GL_RGBA4$1;
    this.width = 0;
    this.height = 0;

    if (config.profile) {
      this.stats = {size: 0};
    }
  }

  REGLRenderbuffer.prototype.decRef = function () {
    if (--this.refCount <= 0) {
      destroy(this);
    }
  };

  function destroy (rb) {
    var handle = rb.renderbuffer;
    check$1(handle, 'must not double destroy renderbuffer');
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
    gl.deleteRenderbuffer(handle);
    rb.renderbuffer = null;
    rb.refCount = 0;
    delete renderbufferSet[rb.id];
    stats.renderbufferCount--;
  }

  function createRenderbuffer (a, b) {
    var renderbuffer = new REGLRenderbuffer(gl.createRenderbuffer());
    renderbufferSet[renderbuffer.id] = renderbuffer;
    stats.renderbufferCount++;

    function reglRenderbuffer (a, b) {
      var w = 0;
      var h = 0;
      var format = GL_RGBA4$1;

      if (typeof a === 'object' && a) {
        var options = a;
        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid renderbuffer shape');
          w = shape[0] | 0;
          h = shape[1] | 0;
        } else {
          if ('radius' in options) {
            w = h = options.radius | 0;
          }
          if ('width' in options) {
            w = options.width | 0;
          }
          if ('height' in options) {
            h = options.height | 0;
          }
        }
        if ('format' in options) {
          check$1.parameter(options.format, formatTypes,
            'invalid renderbuffer format');
          format = formatTypes[options.format];
        }
      } else if (typeof a === 'number') {
        w = a | 0;
        if (typeof b === 'number') {
          h = b | 0;
        } else {
          h = w;
        }
      } else if (!a) {
        w = h = 1;
      } else {
        check$1.raise('invalid arguments to renderbuffer constructor');
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      if (w === renderbuffer.width &&
          h === renderbuffer.height &&
          format === renderbuffer.format) {
        return
      }

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;
      renderbuffer.format = format;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, format, w, h);

      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }
      reglRenderbuffer.format = formatTypesInvert[renderbuffer.format];

      return reglRenderbuffer
    }

    function resize (w_, h_) {
      var w = w_ | 0;
      var h = (h_ | 0) || w;

      if (w === renderbuffer.width && h === renderbuffer.height) {
        return reglRenderbuffer
      }

      // check shape
      check$1(
        w > 0 && h > 0 &&
        w <= limits.maxRenderbufferSize && h <= limits.maxRenderbufferSize,
        'invalid renderbuffer size');

      reglRenderbuffer.width = renderbuffer.width = w;
      reglRenderbuffer.height = renderbuffer.height = h;

      gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, renderbuffer.format, w, h);

      // also, recompute size.
      if (config.profile) {
        renderbuffer.stats.size = getRenderbufferSize(
          renderbuffer.format, renderbuffer.width, renderbuffer.height);
      }

      return reglRenderbuffer
    }

    reglRenderbuffer(a, b);

    reglRenderbuffer.resize = resize;
    reglRenderbuffer._reglType = 'renderbuffer';
    reglRenderbuffer._renderbuffer = renderbuffer;
    if (config.profile) {
      reglRenderbuffer.stats = renderbuffer.stats;
    }
    reglRenderbuffer.destroy = function () {
      renderbuffer.decRef();
    };

    return reglRenderbuffer
  }

  if (config.profile) {
    stats.getTotalRenderbufferSize = function () {
      var total = 0;
      Object.keys(renderbufferSet).forEach(function (key) {
        total += renderbufferSet[key].stats.size;
      });
      return total
    };
  }

  function restoreRenderbuffers () {
    values(renderbufferSet).forEach(function (rb) {
      rb.renderbuffer = gl.createRenderbuffer();
      gl.bindRenderbuffer(GL_RENDERBUFFER, rb.renderbuffer);
      gl.renderbufferStorage(GL_RENDERBUFFER, rb.format, rb.width, rb.height);
    });
    gl.bindRenderbuffer(GL_RENDERBUFFER, null);
  }

  return {
    create: createRenderbuffer,
    clear: function () {
      values(renderbufferSet).forEach(destroy);
    },
    restore: restoreRenderbuffers
  }
};

// We store these constants so that the minifier can inline them
var GL_FRAMEBUFFER = 0x8D40;
var GL_RENDERBUFFER$1 = 0x8D41;

var GL_TEXTURE_2D$1 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 = 0x8515;

var GL_COLOR_ATTACHMENT0 = 0x8CE0;
var GL_DEPTH_ATTACHMENT = 0x8D00;
var GL_STENCIL_ATTACHMENT = 0x8D20;
var GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

var GL_FRAMEBUFFER_COMPLETE = 0x8CD5;
var GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6;
var GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7;
var GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9;
var GL_FRAMEBUFFER_UNSUPPORTED = 0x8CDD;

var GL_HALF_FLOAT_OES$2 = 0x8D61;
var GL_UNSIGNED_BYTE$5 = 0x1401;
var GL_FLOAT$4 = 0x1406;

var GL_RGBA$1 = 0x1908;

var GL_DEPTH_COMPONENT$1 = 0x1902;

var colorTextureFormatEnums = [
  GL_RGBA$1
];

// for every texture format, store
// the number of channels
var textureFormatChannels = [];
textureFormatChannels[GL_RGBA$1] = 4;

// for every texture type, store
// the size in bytes.
var textureTypeSizes = [];
textureTypeSizes[GL_UNSIGNED_BYTE$5] = 1;
textureTypeSizes[GL_FLOAT$4] = 4;
textureTypeSizes[GL_HALF_FLOAT_OES$2] = 2;

var GL_RGBA4$2 = 0x8056;
var GL_RGB5_A1$2 = 0x8057;
var GL_RGB565$2 = 0x8D62;
var GL_DEPTH_COMPONENT16$1 = 0x81A5;
var GL_STENCIL_INDEX8$1 = 0x8D48;
var GL_DEPTH_STENCIL$2 = 0x84F9;

var GL_SRGB8_ALPHA8_EXT$1 = 0x8C43;

var GL_RGBA32F_EXT$1 = 0x8814;

var GL_RGBA16F_EXT$1 = 0x881A;
var GL_RGB16F_EXT$1 = 0x881B;

var colorRenderbufferFormatEnums = [
  GL_RGBA4$2,
  GL_RGB5_A1$2,
  GL_RGB565$2,
  GL_SRGB8_ALPHA8_EXT$1,
  GL_RGBA16F_EXT$1,
  GL_RGB16F_EXT$1,
  GL_RGBA32F_EXT$1
];

var statusCode = {};
statusCode[GL_FRAMEBUFFER_COMPLETE] = 'complete';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_ATTACHMENT] = 'incomplete attachment';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_DIMENSIONS] = 'incomplete dimensions';
statusCode[GL_FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT] = 'incomplete, missing attachment';
statusCode[GL_FRAMEBUFFER_UNSUPPORTED] = 'unsupported';

function wrapFBOState (
  gl,
  extensions,
  limits,
  textureState,
  renderbufferState,
  stats) {
  var framebufferState = {
    cur: null,
    next: null,
    dirty: false,
    setFBO: null
  };

  var colorTextureFormats = ['rgba'];
  var colorRenderbufferFormats = ['rgba4', 'rgb565', 'rgb5 a1'];

  if (extensions.ext_srgb) {
    colorRenderbufferFormats.push('srgba');
  }

  if (extensions.ext_color_buffer_half_float) {
    colorRenderbufferFormats.push('rgba16f', 'rgb16f');
  }

  if (extensions.webgl_color_buffer_float) {
    colorRenderbufferFormats.push('rgba32f');
  }

  var colorTypes = ['uint8'];
  if (extensions.oes_texture_half_float) {
    colorTypes.push('half float', 'float16');
  }
  if (extensions.oes_texture_float) {
    colorTypes.push('float', 'float32');
  }

  function FramebufferAttachment (target, texture, renderbuffer) {
    this.target = target;
    this.texture = texture;
    this.renderbuffer = renderbuffer;

    var w = 0;
    var h = 0;
    if (texture) {
      w = texture.width;
      h = texture.height;
    } else if (renderbuffer) {
      w = renderbuffer.width;
      h = renderbuffer.height;
    }
    this.width = w;
    this.height = h;
  }

  function decRef (attachment) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture._texture.decRef();
      }
      if (attachment.renderbuffer) {
        attachment.renderbuffer._renderbuffer.decRef();
      }
    }
  }

  function incRefAndCheckShape (attachment, width, height) {
    if (!attachment) {
      return
    }
    if (attachment.texture) {
      var texture = attachment.texture._texture;
      var tw = Math.max(1, texture.width);
      var th = Math.max(1, texture.height);
      check$1(tw === width && th === height,
        'inconsistent width/height for supplied texture');
      texture.refCount += 1;
    } else {
      var renderbuffer = attachment.renderbuffer._renderbuffer;
      check$1(
        renderbuffer.width === width && renderbuffer.height === height,
        'inconsistent width/height for renderbuffer');
      renderbuffer.refCount += 1;
    }
  }

  function attach (location, attachment) {
    if (attachment) {
      if (attachment.texture) {
        gl.framebufferTexture2D(
          GL_FRAMEBUFFER,
          location,
          attachment.target,
          attachment.texture._texture.texture,
          0);
      } else {
        gl.framebufferRenderbuffer(
          GL_FRAMEBUFFER,
          location,
          GL_RENDERBUFFER$1,
          attachment.renderbuffer._renderbuffer.renderbuffer);
      }
    }
  }

  function parseAttachment (attachment) {
    var target = GL_TEXTURE_2D$1;
    var texture = null;
    var renderbuffer = null;

    var data = attachment;
    if (typeof attachment === 'object') {
      data = attachment.data;
      if ('target' in attachment) {
        target = attachment.target | 0;
      }
    }

    check$1.type(data, 'function', 'invalid attachment data');

    var type = data._reglType;
    if (type === 'texture2d') {
      texture = data;
      check$1(target === GL_TEXTURE_2D$1);
    } else if (type === 'textureCube') {
      texture = data;
      check$1(
        target >= GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 &&
        target < GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + 6,
        'invalid cube map target');
    } else if (type === 'renderbuffer') {
      renderbuffer = data;
      target = GL_RENDERBUFFER$1;
    } else {
      check$1.raise('invalid regl object for attachment');
    }

    return new FramebufferAttachment(target, texture, renderbuffer)
  }

  function allocAttachment (
    width,
    height,
    isTexture,
    format,
    type) {
    if (isTexture) {
      var texture = textureState.create2D({
        width: width,
        height: height,
        format: format,
        type: type
      });
      texture._texture.refCount = 0;
      return new FramebufferAttachment(GL_TEXTURE_2D$1, texture, null)
    } else {
      var rb = renderbufferState.create({
        width: width,
        height: height,
        format: format
      });
      rb._renderbuffer.refCount = 0;
      return new FramebufferAttachment(GL_RENDERBUFFER$1, null, rb)
    }
  }

  function unwrapAttachment (attachment) {
    return attachment && (attachment.texture || attachment.renderbuffer)
  }

  function resizeAttachment (attachment, w, h) {
    if (attachment) {
      if (attachment.texture) {
        attachment.texture.resize(w, h);
      } else if (attachment.renderbuffer) {
        attachment.renderbuffer.resize(w, h);
      }
    }
  }

  var framebufferCount = 0;
  var framebufferSet = {};

  function REGLFramebuffer () {
    this.id = framebufferCount++;
    framebufferSet[this.id] = this;

    this.framebuffer = gl.createFramebuffer();
    this.width = 0;
    this.height = 0;

    this.colorAttachments = [];
    this.depthAttachment = null;
    this.stencilAttachment = null;
    this.depthStencilAttachment = null;
  }

  function decFBORefs (framebuffer) {
    framebuffer.colorAttachments.forEach(decRef);
    decRef(framebuffer.depthAttachment);
    decRef(framebuffer.stencilAttachment);
    decRef(framebuffer.depthStencilAttachment);
  }

  function destroy (framebuffer) {
    var handle = framebuffer.framebuffer;
    check$1(handle, 'must not double destroy framebuffer');
    gl.deleteFramebuffer(handle);
    framebuffer.framebuffer = null;
    stats.framebufferCount--;
    delete framebufferSet[framebuffer.id];
  }

  function updateFramebuffer (framebuffer) {
    var i;

    gl.bindFramebuffer(GL_FRAMEBUFFER, framebuffer.framebuffer);
    var colorAttachments = framebuffer.colorAttachments;
    for (i = 0; i < colorAttachments.length; ++i) {
      attach(GL_COLOR_ATTACHMENT0 + i, colorAttachments[i]);
    }
    for (i = colorAttachments.length; i < limits.maxColorAttachments; ++i) {
      gl.framebufferTexture2D(
        GL_FRAMEBUFFER,
        GL_COLOR_ATTACHMENT0 + i,
        GL_TEXTURE_2D$1,
        null,
        0);
    }

    gl.framebufferTexture2D(
      GL_FRAMEBUFFER,
      GL_DEPTH_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$1,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER,
      GL_DEPTH_ATTACHMENT,
      GL_TEXTURE_2D$1,
      null,
      0);
    gl.framebufferTexture2D(
      GL_FRAMEBUFFER,
      GL_STENCIL_ATTACHMENT,
      GL_TEXTURE_2D$1,
      null,
      0);

    attach(GL_DEPTH_ATTACHMENT, framebuffer.depthAttachment);
    attach(GL_STENCIL_ATTACHMENT, framebuffer.stencilAttachment);
    attach(GL_DEPTH_STENCIL_ATTACHMENT, framebuffer.depthStencilAttachment);

    // Check status code
    var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);
    if (status !== GL_FRAMEBUFFER_COMPLETE) {
      check$1.raise('framebuffer configuration not supported, status = ' +
        statusCode[status]);
    }

    gl.bindFramebuffer(GL_FRAMEBUFFER, framebufferState.next);
    framebufferState.cur = framebufferState.next;

    // FIXME: Clear error code here.  This is a work around for a bug in
    // headless-gl
    gl.getError();
  }

  function createFBO (a0, a1) {
    var framebuffer = new REGLFramebuffer();
    stats.framebufferCount++;

    function reglFramebuffer (a, b) {
      var i;

      check$1(framebufferState.next !== framebuffer,
        'can not update framebuffer which is currently in use');

      var extDrawBuffers = extensions.webgl_draw_buffers;

      var width = 0;
      var height = 0;

      var needsDepth = true;
      var needsStencil = true;

      var colorBuffer = null;
      var colorTexture = true;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      var depthBuffer = null;
      var stencilBuffer = null;
      var depthStencilBuffer = null;
      var depthStencilTexture = false;

      if (typeof a === 'number') {
        width = a | 0;
        height = (b | 0) || width;
      } else if (!a) {
        width = height = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          width = shape[0];
          height = shape[1];
        } else {
          if ('radius' in options) {
            width = height = options.radius;
          }
          if ('width' in options) {
            width = options.width;
          }
          if ('height' in options) {
            height = options.height;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extDrawBuffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorTexture' in options) {
            colorTexture = !!options.colorTexture;
            colorFormat = 'rgba4';
          }

          if ('colorType' in options) {
            colorType = options.colorType;
            if (!colorTexture) {
              if (colorType === 'half float' || colorType === 'float16') {
                check$1(extensions.ext_color_buffer_half_float,
                  'you must enable EXT_color_buffer_half_float to use 16-bit render buffers');
                colorFormat = 'rgba16f';
              } else if (colorType === 'float' || colorType === 'float32') {
                check$1(extensions.webgl_color_buffer_float,
                  'you must enable WEBGL_color_buffer_float in order to use 32-bit floating point renderbuffers');
                colorFormat = 'rgba32f';
              }
            } else {
              check$1(extensions.oes_texture_float ||
                !(colorType === 'float' || colorType === 'float32'),
                'you must enable OES_texture_float in order to use floating point framebuffer objects');
              check$1(extensions.oes_texture_half_float ||
                !(colorType === 'half float' || colorType === 'float16'),
                'you must enable OES_texture_half_float in order to use 16-bit floating point framebuffer objects');
            }
            check$1.oneOf(colorType, colorTypes, 'invalid color type');
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            if (colorTextureFormats.indexOf(colorFormat) >= 0) {
              colorTexture = true;
            } else if (colorRenderbufferFormats.indexOf(colorFormat) >= 0) {
              colorTexture = false;
            } else {
              if (colorTexture) {
                check$1.oneOf(
                  options.colorFormat, colorTextureFormats,
                  'invalid color format for texture');
              } else {
                check$1.oneOf(
                  options.colorFormat, colorRenderbufferFormats,
                  'invalid color format for renderbuffer');
              }
            }
          }
        }

        if ('depthTexture' in options || 'depthStencilTexture' in options) {
          depthStencilTexture = !!(options.depthTexture ||
            options.depthStencilTexture);
          check$1(!depthStencilTexture || extensions.webgl_depth_texture,
            'webgl_depth_texture extension not supported');
        }

        if ('depth' in options) {
          if (typeof options.depth === 'boolean') {
            needsDepth = options.depth;
          } else {
            depthBuffer = options.depth;
            needsStencil = false;
          }
        }

        if ('stencil' in options) {
          if (typeof options.stencil === 'boolean') {
            needsStencil = options.stencil;
          } else {
            stencilBuffer = options.stencil;
            needsDepth = false;
          }
        }

        if ('depthStencil' in options) {
          if (typeof options.depthStencil === 'boolean') {
            needsDepth = needsStencil = options.depthStencil;
          } else {
            depthStencilBuffer = options.depthStencil;
            needsDepth = false;
            needsStencil = false;
          }
        }
      }

      // parse attachments
      var colorAttachments = null;
      var depthAttachment = null;
      var stencilAttachment = null;
      var depthStencilAttachment = null;

      // Set up color attachments
      if (Array.isArray(colorBuffer)) {
        colorAttachments = colorBuffer.map(parseAttachment);
      } else if (colorBuffer) {
        colorAttachments = [parseAttachment(colorBuffer)];
      } else {
        colorAttachments = new Array(colorCount);
        for (i = 0; i < colorCount; ++i) {
          colorAttachments[i] = allocAttachment(
            width,
            height,
            colorTexture,
            colorFormat,
            colorType);
        }
      }

      check$1(extensions.webgl_draw_buffers || colorAttachments.length <= 1,
        'you must enable the WEBGL_draw_buffers extension in order to use multiple color buffers.');
      check$1(colorAttachments.length <= limits.maxColorAttachments,
        'too many color attachments, not supported');

      width = width || colorAttachments[0].width;
      height = height || colorAttachments[0].height;

      if (depthBuffer) {
        depthAttachment = parseAttachment(depthBuffer);
      } else if (needsDepth && !needsStencil) {
        depthAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth',
          'uint32');
      }

      if (stencilBuffer) {
        stencilAttachment = parseAttachment(stencilBuffer);
      } else if (needsStencil && !needsDepth) {
        stencilAttachment = allocAttachment(
          width,
          height,
          false,
          'stencil',
          'uint8');
      }

      if (depthStencilBuffer) {
        depthStencilAttachment = parseAttachment(depthStencilBuffer);
      } else if (!depthBuffer && !stencilBuffer && needsStencil && needsDepth) {
        depthStencilAttachment = allocAttachment(
          width,
          height,
          depthStencilTexture,
          'depth stencil',
          'depth stencil');
      }

      check$1(
        (!!depthBuffer) + (!!stencilBuffer) + (!!depthStencilBuffer) <= 1,
        'invalid framebuffer configuration, can specify exactly one depth/stencil attachment');

      var commonColorAttachmentSize = null;

      for (i = 0; i < colorAttachments.length; ++i) {
        incRefAndCheckShape(colorAttachments[i], width, height);
        check$1(!colorAttachments[i] ||
          (colorAttachments[i].texture &&
            colorTextureFormatEnums.indexOf(colorAttachments[i].texture._texture.format) >= 0) ||
          (colorAttachments[i].renderbuffer &&
            colorRenderbufferFormatEnums.indexOf(colorAttachments[i].renderbuffer._renderbuffer.format) >= 0),
          'framebuffer color attachment ' + i + ' is invalid');

        if (colorAttachments[i] && colorAttachments[i].texture) {
          var colorAttachmentSize =
              textureFormatChannels[colorAttachments[i].texture._texture.format] *
              textureTypeSizes[colorAttachments[i].texture._texture.type];

          if (commonColorAttachmentSize === null) {
            commonColorAttachmentSize = colorAttachmentSize;
          } else {
            // We need to make sure that all color attachments have the same number of bitplanes
            // (that is, the same numer of bits per pixel)
            // This is required by the GLES2.0 standard. See the beginning of Chapter 4 in that document.
            check$1(commonColorAttachmentSize === colorAttachmentSize,
                  'all color attachments much have the same number of bits per pixel.');
          }
        }
      }
      incRefAndCheckShape(depthAttachment, width, height);
      check$1(!depthAttachment ||
        (depthAttachment.texture &&
          depthAttachment.texture._texture.format === GL_DEPTH_COMPONENT$1) ||
        (depthAttachment.renderbuffer &&
          depthAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_COMPONENT16$1),
        'invalid depth attachment for framebuffer object');
      incRefAndCheckShape(stencilAttachment, width, height);
      check$1(!stencilAttachment ||
        (stencilAttachment.renderbuffer &&
          stencilAttachment.renderbuffer._renderbuffer.format === GL_STENCIL_INDEX8$1),
        'invalid stencil attachment for framebuffer object');
      incRefAndCheckShape(depthStencilAttachment, width, height);
      check$1(!depthStencilAttachment ||
        (depthStencilAttachment.texture &&
          depthStencilAttachment.texture._texture.format === GL_DEPTH_STENCIL$2) ||
        (depthStencilAttachment.renderbuffer &&
          depthStencilAttachment.renderbuffer._renderbuffer.format === GL_DEPTH_STENCIL$2),
        'invalid depth-stencil attachment for framebuffer object');

      // decrement references
      decFBORefs(framebuffer);

      framebuffer.width = width;
      framebuffer.height = height;

      framebuffer.colorAttachments = colorAttachments;
      framebuffer.depthAttachment = depthAttachment;
      framebuffer.stencilAttachment = stencilAttachment;
      framebuffer.depthStencilAttachment = depthStencilAttachment;

      reglFramebuffer.color = colorAttachments.map(unwrapAttachment);
      reglFramebuffer.depth = unwrapAttachment(depthAttachment);
      reglFramebuffer.stencil = unwrapAttachment(stencilAttachment);
      reglFramebuffer.depthStencil = unwrapAttachment(depthStencilAttachment);

      reglFramebuffer.width = framebuffer.width;
      reglFramebuffer.height = framebuffer.height;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    function resize (w_, h_) {
      check$1(framebufferState.next !== framebuffer,
        'can not resize a framebuffer which is currently in use');

      var w = w_ | 0;
      var h = (h_ | 0) || w;
      if (w === framebuffer.width && h === framebuffer.height) {
        return reglFramebuffer
      }

      // resize all buffers
      var colorAttachments = framebuffer.colorAttachments;
      for (var i = 0; i < colorAttachments.length; ++i) {
        resizeAttachment(colorAttachments[i], w, h);
      }
      resizeAttachment(framebuffer.depthAttachment, w, h);
      resizeAttachment(framebuffer.stencilAttachment, w, h);
      resizeAttachment(framebuffer.depthStencilAttachment, w, h);

      framebuffer.width = reglFramebuffer.width = w;
      framebuffer.height = reglFramebuffer.height = h;

      updateFramebuffer(framebuffer);

      return reglFramebuffer
    }

    reglFramebuffer(a0, a1);

    return extend(reglFramebuffer, {
      resize: resize,
      _reglType: 'framebuffer',
      _framebuffer: framebuffer,
      destroy: function () {
        destroy(framebuffer);
        decFBORefs(framebuffer);
      },
      use: function (block) {
        framebufferState.setFBO({
          framebuffer: reglFramebuffer
        }, block);
      }
    })
  }

  function createCubeFBO (options) {
    var faces = Array(6);

    function reglFramebufferCube (a) {
      var i;

      check$1(faces.indexOf(framebufferState.next) < 0,
        'can not update framebuffer which is currently in use');

      var extDrawBuffers = extensions.webgl_draw_buffers;

      var params = {
        color: null
      };

      var radius = 0;

      var colorBuffer = null;
      var colorFormat = 'rgba';
      var colorType = 'uint8';
      var colorCount = 1;

      if (typeof a === 'number') {
        radius = a | 0;
      } else if (!a) {
        radius = 1;
      } else {
        check$1.type(a, 'object', 'invalid arguments for framebuffer');
        var options = a;

        if ('shape' in options) {
          var shape = options.shape;
          check$1(
            Array.isArray(shape) && shape.length >= 2,
            'invalid shape for framebuffer');
          check$1(
            shape[0] === shape[1],
            'cube framebuffer must be square');
          radius = shape[0];
        } else {
          if ('radius' in options) {
            radius = options.radius | 0;
          }
          if ('width' in options) {
            radius = options.width | 0;
            if ('height' in options) {
              check$1(options.height === radius, 'must be square');
            }
          } else if ('height' in options) {
            radius = options.height | 0;
          }
        }

        if ('color' in options ||
            'colors' in options) {
          colorBuffer =
            options.color ||
            options.colors;
          if (Array.isArray(colorBuffer)) {
            check$1(
              colorBuffer.length === 1 || extDrawBuffers,
              'multiple render targets not supported');
          }
        }

        if (!colorBuffer) {
          if ('colorCount' in options) {
            colorCount = options.colorCount | 0;
            check$1(colorCount > 0, 'invalid color buffer count');
          }

          if ('colorType' in options) {
            check$1.oneOf(
              options.colorType, colorTypes,
              'invalid color type');
            colorType = options.colorType;
          }

          if ('colorFormat' in options) {
            colorFormat = options.colorFormat;
            check$1.oneOf(
              options.colorFormat, colorTextureFormats,
              'invalid color format for texture');
          }
        }

        if ('depth' in options) {
          params.depth = options.depth;
        }

        if ('stencil' in options) {
          params.stencil = options.stencil;
        }

        if ('depthStencil' in options) {
          params.depthStencil = options.depthStencil;
        }
      }

      var colorCubes;
      if (colorBuffer) {
        if (Array.isArray(colorBuffer)) {
          colorCubes = [];
          for (i = 0; i < colorBuffer.length; ++i) {
            colorCubes[i] = colorBuffer[i];
          }
        } else {
          colorCubes = [ colorBuffer ];
        }
      } else {
        colorCubes = Array(colorCount);
        var cubeMapParams = {
          radius: radius,
          format: colorFormat,
          type: colorType
        };
        for (i = 0; i < colorCount; ++i) {
          colorCubes[i] = textureState.createCube(cubeMapParams);
        }
      }

      // Check color cubes
      params.color = Array(colorCubes.length);
      for (i = 0; i < colorCubes.length; ++i) {
        var cube = colorCubes[i];
        check$1(
          typeof cube === 'function' && cube._reglType === 'textureCube',
          'invalid cube map');
        radius = radius || cube.width;
        check$1(
          cube.width === radius && cube.height === radius,
          'invalid cube map shape');
        params.color[i] = {
          target: GL_TEXTURE_CUBE_MAP_POSITIVE_X$1,
          data: colorCubes[i]
        };
      }

      for (i = 0; i < 6; ++i) {
        for (var j = 0; j < colorCubes.length; ++j) {
          params.color[j].target = GL_TEXTURE_CUBE_MAP_POSITIVE_X$1 + i;
        }
        // reuse depth-stencil attachments across all cube maps
        if (i > 0) {
          params.depth = faces[0].depth;
          params.stencil = faces[0].stencil;
          params.depthStencil = faces[0].depthStencil;
        }
        if (faces[i]) {
          (faces[i])(params);
        } else {
          faces[i] = createFBO(params);
        }
      }

      return extend(reglFramebufferCube, {
        width: radius,
        height: radius,
        color: colorCubes
      })
    }

    function resize (radius_) {
      var i;
      var radius = radius_ | 0;
      check$1(radius > 0 && radius <= limits.maxCubeMapSize,
        'invalid radius for cube fbo');

      if (radius === reglFramebufferCube.width) {
        return reglFramebufferCube
      }

      var colors = reglFramebufferCube.color;
      for (i = 0; i < colors.length; ++i) {
        colors[i].resize(radius);
      }

      for (i = 0; i < 6; ++i) {
        faces[i].resize(radius);
      }

      reglFramebufferCube.width = reglFramebufferCube.height = radius;

      return reglFramebufferCube
    }

    reglFramebufferCube(options);

    return extend(reglFramebufferCube, {
      faces: faces,
      resize: resize,
      _reglType: 'framebufferCube',
      destroy: function () {
        faces.forEach(function (f) {
          f.destroy();
        });
      }
    })
  }

  function restoreFramebuffers () {
    values(framebufferSet).forEach(function (fb) {
      fb.framebuffer = gl.createFramebuffer();
      updateFramebuffer(fb);
    });
  }

  return extend(framebufferState, {
    getFramebuffer: function (object) {
      if (typeof object === 'function' && object._reglType === 'framebuffer') {
        var fbo = object._framebuffer;
        if (fbo instanceof REGLFramebuffer) {
          return fbo
        }
      }
      return null
    },
    create: createFBO,
    createCube: createCubeFBO,
    clear: function () {
      values(framebufferSet).forEach(destroy);
    },
    restore: restoreFramebuffers
  })
}

var GL_FLOAT$5 = 5126;

function AttributeRecord () {
  this.state = 0;

  this.x = 0.0;
  this.y = 0.0;
  this.z = 0.0;
  this.w = 0.0;

  this.buffer = null;
  this.size = 0;
  this.normalized = false;
  this.type = GL_FLOAT$5;
  this.offset = 0;
  this.stride = 0;
  this.divisor = 0;
}

function wrapAttributeState (
  gl,
  extensions,
  limits,
  bufferState,
  stringStore) {
  var NUM_ATTRIBUTES = limits.maxAttributes;
  var attributeBindings = new Array(NUM_ATTRIBUTES);
  for (var i = 0; i < NUM_ATTRIBUTES; ++i) {
    attributeBindings[i] = new AttributeRecord();
  }

  return {
    Record: AttributeRecord,
    scope: {},
    state: attributeBindings
  }
}

var GL_FRAGMENT_SHADER = 35632;
var GL_VERTEX_SHADER = 35633;

var GL_ACTIVE_UNIFORMS = 0x8B86;
var GL_ACTIVE_ATTRIBUTES = 0x8B89;

function wrapShaderState (gl, stringStore, stats, config) {
  // ===================================================
  // glsl compilation and linking
  // ===================================================
  var fragShaders = {};
  var vertShaders = {};

  function ActiveInfo (name, id, location, info) {
    this.name = name;
    this.id = id;
    this.location = location;
    this.info = info;
  }

  function insertActiveInfo (list, info) {
    for (var i = 0; i < list.length; ++i) {
      if (list[i].id === info.id) {
        list[i].location = info.location;
        return
      }
    }
    list.push(info);
  }

  function getShader (type, id, command) {
    var cache = type === GL_FRAGMENT_SHADER ? fragShaders : vertShaders;
    var shader = cache[id];

    if (!shader) {
      var source = stringStore.str(id);
      shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      check$1.shaderError(gl, shader, source, type, command);
      cache[id] = shader;
    }

    return shader
  }

  // ===================================================
  // program linking
  // ===================================================
  var programCache = {};
  var programList = [];

  var PROGRAM_COUNTER = 0;

  function REGLProgram (fragId, vertId) {
    this.id = PROGRAM_COUNTER++;
    this.fragId = fragId;
    this.vertId = vertId;
    this.program = null;
    this.uniforms = [];
    this.attributes = [];

    if (config.profile) {
      this.stats = {
        uniformsCount: 0,
        attributesCount: 0
      };
    }
  }

  function linkProgram (desc, command) {
    var i, info;

    // -------------------------------
    // compile & link
    // -------------------------------
    var fragShader = getShader(GL_FRAGMENT_SHADER, desc.fragId);
    var vertShader = getShader(GL_VERTEX_SHADER, desc.vertId);

    var program = desc.program = gl.createProgram();
    gl.attachShader(program, fragShader);
    gl.attachShader(program, vertShader);
    gl.linkProgram(program);
    check$1.linkError(
      gl,
      program,
      stringStore.str(desc.fragId),
      stringStore.str(desc.vertId),
      command);

    // -------------------------------
    // grab uniforms
    // -------------------------------
    var numUniforms = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
    if (config.profile) {
      desc.stats.uniformsCount = numUniforms;
    }
    var uniforms = desc.uniforms;
    for (i = 0; i < numUniforms; ++i) {
      info = gl.getActiveUniform(program, i);
      if (info) {
        if (info.size > 1) {
          for (var j = 0; j < info.size; ++j) {
            var name = info.name.replace('[0]', '[' + j + ']');
            insertActiveInfo(uniforms, new ActiveInfo(
              name,
              stringStore.id(name),
              gl.getUniformLocation(program, name),
              info));
          }
        } else {
          insertActiveInfo(uniforms, new ActiveInfo(
            info.name,
            stringStore.id(info.name),
            gl.getUniformLocation(program, info.name),
            info));
        }
      }
    }

    // -------------------------------
    // grab attributes
    // -------------------------------
    var numAttributes = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
    if (config.profile) {
      desc.stats.attributesCount = numAttributes;
    }

    var attributes = desc.attributes;
    for (i = 0; i < numAttributes; ++i) {
      info = gl.getActiveAttrib(program, i);
      if (info) {
        insertActiveInfo(attributes, new ActiveInfo(
          info.name,
          stringStore.id(info.name),
          gl.getAttribLocation(program, info.name),
          info));
      }
    }
  }

  if (config.profile) {
    stats.getMaxUniformsCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.uniformsCount > m) {
          m = desc.stats.uniformsCount;
        }
      });
      return m
    };

    stats.getMaxAttributesCount = function () {
      var m = 0;
      programList.forEach(function (desc) {
        if (desc.stats.attributesCount > m) {
          m = desc.stats.attributesCount;
        }
      });
      return m
    };
  }

  function restoreShaders () {
    fragShaders = {};
    vertShaders = {};
    for (var i = 0; i < programList.length; ++i) {
      linkProgram(programList[i]);
    }
  }

  return {
    clear: function () {
      var deleteShader = gl.deleteShader.bind(gl);
      values(fragShaders).forEach(deleteShader);
      fragShaders = {};
      values(vertShaders).forEach(deleteShader);
      vertShaders = {};

      programList.forEach(function (desc) {
        gl.deleteProgram(desc.program);
      });
      programList.length = 0;
      programCache = {};

      stats.shaderCount = 0;
    },

    program: function (vertId, fragId, command) {
      check$1.command(vertId >= 0, 'missing vertex shader', command);
      check$1.command(fragId >= 0, 'missing fragment shader', command);

      var cache = programCache[fragId];
      if (!cache) {
        cache = programCache[fragId] = {};
      }
      var program = cache[vertId];
      if (!program) {
        program = new REGLProgram(fragId, vertId);
        stats.shaderCount++;

        linkProgram(program, command);
        cache[vertId] = program;
        programList.push(program);
      }
      return program
    },

    restore: restoreShaders,

    shader: getShader,

    frag: -1,
    vert: -1
  }
}

var GL_RGBA$2 = 6408;
var GL_UNSIGNED_BYTE$6 = 5121;
var GL_PACK_ALIGNMENT = 0x0D05;
var GL_FLOAT$6 = 0x1406; // 5126

function wrapReadPixels (
  gl,
  framebufferState,
  reglPoll,
  context,
  glAttributes,
  extensions) {
  function readPixelsImpl (input) {
    var type;
    if (framebufferState.next === null) {
      check$1(
        glAttributes.preserveDrawingBuffer,
        'you must create a webgl context with "preserveDrawingBuffer":true in order to read pixels from the drawing buffer');
      type = GL_UNSIGNED_BYTE$6;
    } else {
      check$1(
        framebufferState.next.colorAttachments[0].texture !== null,
          'You cannot read from a renderbuffer');
      type = framebufferState.next.colorAttachments[0].texture._texture.type;

      if (extensions.oes_texture_float) {
        check$1(
          type === GL_UNSIGNED_BYTE$6 || type === GL_FLOAT$6,
          'Reading from a framebuffer is only allowed for the types \'uint8\' and \'float\'');
      } else {
        check$1(
          type === GL_UNSIGNED_BYTE$6,
          'Reading from a framebuffer is only allowed for the type \'uint8\'');
      }
    }

    var x = 0;
    var y = 0;
    var width = context.framebufferWidth;
    var height = context.framebufferHeight;
    var data = null;

    if (isTypedArray(input)) {
      data = input;
    } else if (input) {
      check$1.type(input, 'object', 'invalid arguments to regl.read()');
      x = input.x | 0;
      y = input.y | 0;
      check$1(
        x >= 0 && x < context.framebufferWidth,
        'invalid x offset for regl.read');
      check$1(
        y >= 0 && y < context.framebufferHeight,
        'invalid y offset for regl.read');
      width = (input.width || (context.framebufferWidth - x)) | 0;
      height = (input.height || (context.framebufferHeight - y)) | 0;
      data = input.data || null;
    }

    // sanity check input.data
    if (data) {
      if (type === GL_UNSIGNED_BYTE$6) {
        check$1(
          data instanceof Uint8Array,
          'buffer must be \'Uint8Array\' when reading from a framebuffer of type \'uint8\'');
      } else if (type === GL_FLOAT$6) {
        check$1(
          data instanceof Float32Array,
          'buffer must be \'Float32Array\' when reading from a framebuffer of type \'float\'');
      }
    }

    check$1(
      width > 0 && width + x <= context.framebufferWidth,
      'invalid width for read pixels');
    check$1(
      height > 0 && height + y <= context.framebufferHeight,
      'invalid height for read pixels');

    // Update WebGL state
    reglPoll();

    // Compute size
    var size = width * height * 4;

    // Allocate data
    if (!data) {
      if (type === GL_UNSIGNED_BYTE$6) {
        data = new Uint8Array(size);
      } else if (type === GL_FLOAT$6) {
        data = data || new Float32Array(size);
      }
    }

    // Type check
    check$1.isTypedArray(data, 'data buffer for regl.read() must be a typedarray');
    check$1(data.byteLength >= size, 'data buffer for regl.read() too small');

    // Run read pixels
    gl.pixelStorei(GL_PACK_ALIGNMENT, 4);
    gl.readPixels(x, y, width, height, GL_RGBA$2,
                  type,
                  data);

    return data
  }

  function readPixelsFBO (options) {
    var result;
    framebufferState.setFBO({
      framebuffer: options.framebuffer
    }, function () {
      result = readPixelsImpl(options);
    });
    return result
  }

  function readPixels (options) {
    if (!options || !('framebuffer' in options)) {
      return readPixelsImpl(options)
    } else {
      return readPixelsFBO(options)
    }
  }

  return readPixels
}

function slice (x) {
  return Array.prototype.slice.call(x)
}

function join (x) {
  return slice(x).join('')
}

function createEnvironment () {
  // Unique variable id counter
  var varCounter = 0;

  // Linked values are passed from this scope into the generated code block
  // Calling link() passes a value into the generated scope and returns
  // the variable name which it is bound to
  var linkedNames = [];
  var linkedValues = [];
  function link (value) {
    for (var i = 0; i < linkedValues.length; ++i) {
      if (linkedValues[i] === value) {
        return linkedNames[i]
      }
    }

    var name = 'g' + (varCounter++);
    linkedNames.push(name);
    linkedValues.push(value);
    return name
  }

  // create a code block
  function block () {
    var code = [];
    function push () {
      code.push.apply(code, slice(arguments));
    }

    var vars = [];
    function def () {
      var name = 'v' + (varCounter++);
      vars.push(name);

      if (arguments.length > 0) {
        code.push(name, '=');
        code.push.apply(code, slice(arguments));
        code.push(';');
      }

      return name
    }

    return extend(push, {
      def: def,
      toString: function () {
        return join([
          (vars.length > 0 ? 'var ' + vars + ';' : ''),
          join(code)
        ])
      }
    })
  }

  function scope () {
    var entry = block();
    var exit = block();

    var entryToString = entry.toString;
    var exitToString = exit.toString;

    function save (object, prop) {
      exit(object, prop, '=', entry.def(object, prop), ';');
    }

    return extend(function () {
      entry.apply(entry, slice(arguments));
    }, {
      def: entry.def,
      entry: entry,
      exit: exit,
      save: save,
      set: function (object, prop, value) {
        save(object, prop);
        entry(object, prop, '=', value, ';');
      },
      toString: function () {
        return entryToString() + exitToString()
      }
    })
  }

  function conditional () {
    var pred = join(arguments);
    var thenBlock = scope();
    var elseBlock = scope();

    var thenToString = thenBlock.toString;
    var elseToString = elseBlock.toString;

    return extend(thenBlock, {
      then: function () {
        thenBlock.apply(thenBlock, slice(arguments));
        return this
      },
      else: function () {
        elseBlock.apply(elseBlock, slice(arguments));
        return this
      },
      toString: function () {
        var elseClause = elseToString();
        if (elseClause) {
          elseClause = 'else{' + elseClause + '}';
        }
        return join([
          'if(', pred, '){',
          thenToString(),
          '}', elseClause
        ])
      }
    })
  }

  // procedure list
  var globalBlock = block();
  var procedures = {};
  function proc (name, count) {
    var args = [];
    function arg () {
      var name = 'a' + args.length;
      args.push(name);
      return name
    }

    count = count || 0;
    for (var i = 0; i < count; ++i) {
      arg();
    }

    var body = scope();
    var bodyToString = body.toString;

    var result = procedures[name] = extend(body, {
      arg: arg,
      toString: function () {
        return join([
          'function(', args.join(), '){',
          bodyToString(),
          '}'
        ])
      }
    });

    return result
  }

  function compile () {
    var code = ['"use strict";',
      globalBlock,
      'return {'];
    Object.keys(procedures).forEach(function (name) {
      code.push('"', name, '":', procedures[name].toString(), ',');
    });
    code.push('}');
    var src = join(code)
      .replace(/;/g, ';\n')
      .replace(/}/g, '}\n')
      .replace(/{/g, '{\n');
    var proc = Function.apply(null, linkedNames.concat(src));
    return proc.apply(null, linkedValues)
  }

  return {
    global: globalBlock,
    link: link,
    block: block,
    proc: proc,
    scope: scope,
    cond: conditional,
    compile: compile
  }
}

// "cute" names for vector components
var CUTE_COMPONENTS = 'xyzw'.split('');

var GL_UNSIGNED_BYTE$7 = 5121;

var ATTRIB_STATE_POINTER = 1;
var ATTRIB_STATE_CONSTANT = 2;

var DYN_FUNC$1 = 0;
var DYN_PROP$1 = 1;
var DYN_CONTEXT$1 = 2;
var DYN_STATE$1 = 3;
var DYN_THUNK = 4;

var S_DITHER = 'dither';
var S_BLEND_ENABLE = 'blend.enable';
var S_BLEND_COLOR = 'blend.color';
var S_BLEND_EQUATION = 'blend.equation';
var S_BLEND_FUNC = 'blend.func';
var S_DEPTH_ENABLE = 'depth.enable';
var S_DEPTH_FUNC = 'depth.func';
var S_DEPTH_RANGE = 'depth.range';
var S_DEPTH_MASK = 'depth.mask';
var S_COLOR_MASK = 'colorMask';
var S_CULL_ENABLE = 'cull.enable';
var S_CULL_FACE = 'cull.face';
var S_FRONT_FACE = 'frontFace';
var S_LINE_WIDTH = 'lineWidth';
var S_POLYGON_OFFSET_ENABLE = 'polygonOffset.enable';
var S_POLYGON_OFFSET_OFFSET = 'polygonOffset.offset';
var S_SAMPLE_ALPHA = 'sample.alpha';
var S_SAMPLE_ENABLE = 'sample.enable';
var S_SAMPLE_COVERAGE = 'sample.coverage';
var S_STENCIL_ENABLE = 'stencil.enable';
var S_STENCIL_MASK = 'stencil.mask';
var S_STENCIL_FUNC = 'stencil.func';
var S_STENCIL_OPFRONT = 'stencil.opFront';
var S_STENCIL_OPBACK = 'stencil.opBack';
var S_SCISSOR_ENABLE = 'scissor.enable';
var S_SCISSOR_BOX = 'scissor.box';
var S_VIEWPORT = 'viewport';

var S_PROFILE = 'profile';

var S_FRAMEBUFFER = 'framebuffer';
var S_VERT = 'vert';
var S_FRAG = 'frag';
var S_ELEMENTS = 'elements';
var S_PRIMITIVE = 'primitive';
var S_COUNT = 'count';
var S_OFFSET = 'offset';
var S_INSTANCES = 'instances';

var SUFFIX_WIDTH = 'Width';
var SUFFIX_HEIGHT = 'Height';

var S_FRAMEBUFFER_WIDTH = S_FRAMEBUFFER + SUFFIX_WIDTH;
var S_FRAMEBUFFER_HEIGHT = S_FRAMEBUFFER + SUFFIX_HEIGHT;
var S_VIEWPORT_WIDTH = S_VIEWPORT + SUFFIX_WIDTH;
var S_VIEWPORT_HEIGHT = S_VIEWPORT + SUFFIX_HEIGHT;
var S_DRAWINGBUFFER = 'drawingBuffer';
var S_DRAWINGBUFFER_WIDTH = S_DRAWINGBUFFER + SUFFIX_WIDTH;
var S_DRAWINGBUFFER_HEIGHT = S_DRAWINGBUFFER + SUFFIX_HEIGHT;

var NESTED_OPTIONS = [
  S_BLEND_FUNC,
  S_BLEND_EQUATION,
  S_STENCIL_FUNC,
  S_STENCIL_OPFRONT,
  S_STENCIL_OPBACK,
  S_SAMPLE_COVERAGE,
  S_VIEWPORT,
  S_SCISSOR_BOX,
  S_POLYGON_OFFSET_OFFSET
];

var GL_ARRAY_BUFFER$1 = 34962;
var GL_ELEMENT_ARRAY_BUFFER$1 = 34963;

var GL_FRAGMENT_SHADER$1 = 35632;
var GL_VERTEX_SHADER$1 = 35633;

var GL_TEXTURE_2D$2 = 0x0DE1;
var GL_TEXTURE_CUBE_MAP$1 = 0x8513;

var GL_CULL_FACE = 0x0B44;
var GL_BLEND = 0x0BE2;
var GL_DITHER = 0x0BD0;
var GL_STENCIL_TEST = 0x0B90;
var GL_DEPTH_TEST = 0x0B71;
var GL_SCISSOR_TEST = 0x0C11;
var GL_POLYGON_OFFSET_FILL = 0x8037;
var GL_SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
var GL_SAMPLE_COVERAGE = 0x80A0;

var GL_FLOAT$7 = 5126;
var GL_FLOAT_VEC2 = 35664;
var GL_FLOAT_VEC3 = 35665;
var GL_FLOAT_VEC4 = 35666;
var GL_INT$3 = 5124;
var GL_INT_VEC2 = 35667;
var GL_INT_VEC3 = 35668;
var GL_INT_VEC4 = 35669;
var GL_BOOL = 35670;
var GL_BOOL_VEC2 = 35671;
var GL_BOOL_VEC3 = 35672;
var GL_BOOL_VEC4 = 35673;
var GL_FLOAT_MAT2 = 35674;
var GL_FLOAT_MAT3 = 35675;
var GL_FLOAT_MAT4 = 35676;
var GL_SAMPLER_2D = 35678;
var GL_SAMPLER_CUBE = 35680;

var GL_TRIANGLES$1 = 4;

var GL_FRONT = 1028;
var GL_BACK = 1029;
var GL_CW = 0x0900;
var GL_CCW = 0x0901;
var GL_MIN_EXT = 0x8007;
var GL_MAX_EXT = 0x8008;
var GL_ALWAYS = 519;
var GL_KEEP = 7680;
var GL_ZERO = 0;
var GL_ONE = 1;
var GL_FUNC_ADD = 0x8006;
var GL_LESS = 513;

var GL_FRAMEBUFFER$1 = 0x8D40;
var GL_COLOR_ATTACHMENT0$1 = 0x8CE0;

var blendFuncs = {
  '0': 0,
  '1': 1,
  'zero': 0,
  'one': 1,
  'src color': 768,
  'one minus src color': 769,
  'src alpha': 770,
  'one minus src alpha': 771,
  'dst color': 774,
  'one minus dst color': 775,
  'dst alpha': 772,
  'one minus dst alpha': 773,
  'constant color': 32769,
  'one minus constant color': 32770,
  'constant alpha': 32771,
  'one minus constant alpha': 32772,
  'src alpha saturate': 776
};

// There are invalid values for srcRGB and dstRGB. See:
// https://www.khronos.org/registry/webgl/specs/1.0/#6.13
// https://github.com/KhronosGroup/WebGL/blob/0d3201f5f7ec3c0060bc1f04077461541f1987b9/conformance-suites/1.0.3/conformance/misc/webgl-specific.html#L56
var invalidBlendCombinations = [
  'constant color, constant alpha',
  'one minus constant color, constant alpha',
  'constant color, one minus constant alpha',
  'one minus constant color, one minus constant alpha',
  'constant alpha, constant color',
  'constant alpha, one minus constant color',
  'one minus constant alpha, constant color',
  'one minus constant alpha, one minus constant color'
];

var compareFuncs = {
  'never': 512,
  'less': 513,
  '<': 513,
  'equal': 514,
  '=': 514,
  '==': 514,
  '===': 514,
  'lequal': 515,
  '<=': 515,
  'greater': 516,
  '>': 516,
  'notequal': 517,
  '!=': 517,
  '!==': 517,
  'gequal': 518,
  '>=': 518,
  'always': 519
};

var stencilOps = {
  '0': 0,
  'zero': 0,
  'keep': 7680,
  'replace': 7681,
  'increment': 7682,
  'decrement': 7683,
  'increment wrap': 34055,
  'decrement wrap': 34056,
  'invert': 5386
};

var shaderType = {
  'frag': GL_FRAGMENT_SHADER$1,
  'vert': GL_VERTEX_SHADER$1
};

var orientationType = {
  'cw': GL_CW,
  'ccw': GL_CCW
};

function isBufferArgs (x) {
  return Array.isArray(x) ||
    isTypedArray(x) ||
    isNDArrayLike(x)
}

// Make sure viewport is processed first
function sortState (state) {
  return state.sort(function (a, b) {
    if (a === S_VIEWPORT) {
      return -1
    } else if (b === S_VIEWPORT) {
      return 1
    }
    return (a < b) ? -1 : 1
  })
}

function Declaration (thisDep, contextDep, propDep, append) {
  this.thisDep = thisDep;
  this.contextDep = contextDep;
  this.propDep = propDep;
  this.append = append;
}

function isStatic (decl) {
  return decl && !(decl.thisDep || decl.contextDep || decl.propDep)
}

function createStaticDecl (append) {
  return new Declaration(false, false, false, append)
}

function createDynamicDecl (dyn, append) {
  var type = dyn.type;
  if (type === DYN_FUNC$1) {
    var numArgs = dyn.data.length;
    return new Declaration(
      true,
      numArgs >= 1,
      numArgs >= 2,
      append)
  } else if (type === DYN_THUNK) {
    var data = dyn.data;
    return new Declaration(
      data.thisDep,
      data.contextDep,
      data.propDep,
      append)
  } else {
    return new Declaration(
      type === DYN_STATE$1,
      type === DYN_CONTEXT$1,
      type === DYN_PROP$1,
      append)
  }
}

var SCOPE_DECL = new Declaration(false, false, false, function () {});

function reglCore (
  gl,
  stringStore,
  extensions,
  limits,
  bufferState,
  elementState,
  textureState,
  framebufferState,
  uniformState,
  attributeState,
  shaderState,
  drawState,
  contextState,
  timer,
  config) {
  var AttributeRecord = attributeState.Record;

  var blendEquations = {
    'add': 32774,
    'subtract': 32778,
    'reverse subtract': 32779
  };
  if (extensions.ext_blend_minmax) {
    blendEquations.min = GL_MIN_EXT;
    blendEquations.max = GL_MAX_EXT;
  }

  var extInstancing = extensions.angle_instanced_arrays;
  var extDrawBuffers = extensions.webgl_draw_buffers;

  // ===================================================
  // ===================================================
  // WEBGL STATE
  // ===================================================
  // ===================================================
  var currentState = {
    dirty: true,
    profile: config.profile
  };
  var nextState = {};
  var GL_STATE_NAMES = [];
  var GL_FLAGS = {};
  var GL_VARIABLES = {};

  function propName (name) {
    return name.replace('.', '_')
  }

  function stateFlag (sname, cap, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    nextState[name] = currentState[name] = !!init;
    GL_FLAGS[name] = cap;
  }

  function stateVariable (sname, func, init) {
    var name = propName(sname);
    GL_STATE_NAMES.push(sname);
    if (Array.isArray(init)) {
      currentState[name] = init.slice();
      nextState[name] = init.slice();
    } else {
      currentState[name] = nextState[name] = init;
    }
    GL_VARIABLES[name] = func;
  }

  // Dithering
  stateFlag(S_DITHER, GL_DITHER);

  // Blending
  stateFlag(S_BLEND_ENABLE, GL_BLEND);
  stateVariable(S_BLEND_COLOR, 'blendColor', [0, 0, 0, 0]);
  stateVariable(S_BLEND_EQUATION, 'blendEquationSeparate',
    [GL_FUNC_ADD, GL_FUNC_ADD]);
  stateVariable(S_BLEND_FUNC, 'blendFuncSeparate',
    [GL_ONE, GL_ZERO, GL_ONE, GL_ZERO]);

  // Depth
  stateFlag(S_DEPTH_ENABLE, GL_DEPTH_TEST, true);
  stateVariable(S_DEPTH_FUNC, 'depthFunc', GL_LESS);
  stateVariable(S_DEPTH_RANGE, 'depthRange', [0, 1]);
  stateVariable(S_DEPTH_MASK, 'depthMask', true);

  // Color mask
  stateVariable(S_COLOR_MASK, S_COLOR_MASK, [true, true, true, true]);

  // Face culling
  stateFlag(S_CULL_ENABLE, GL_CULL_FACE);
  stateVariable(S_CULL_FACE, 'cullFace', GL_BACK);

  // Front face orientation
  stateVariable(S_FRONT_FACE, S_FRONT_FACE, GL_CCW);

  // Line width
  stateVariable(S_LINE_WIDTH, S_LINE_WIDTH, 1);

  // Polygon offset
  stateFlag(S_POLYGON_OFFSET_ENABLE, GL_POLYGON_OFFSET_FILL);
  stateVariable(S_POLYGON_OFFSET_OFFSET, 'polygonOffset', [0, 0]);

  // Sample coverage
  stateFlag(S_SAMPLE_ALPHA, GL_SAMPLE_ALPHA_TO_COVERAGE);
  stateFlag(S_SAMPLE_ENABLE, GL_SAMPLE_COVERAGE);
  stateVariable(S_SAMPLE_COVERAGE, 'sampleCoverage', [1, false]);

  // Stencil
  stateFlag(S_STENCIL_ENABLE, GL_STENCIL_TEST);
  stateVariable(S_STENCIL_MASK, 'stencilMask', -1);
  stateVariable(S_STENCIL_FUNC, 'stencilFunc', [GL_ALWAYS, 0, -1]);
  stateVariable(S_STENCIL_OPFRONT, 'stencilOpSeparate',
    [GL_FRONT, GL_KEEP, GL_KEEP, GL_KEEP]);
  stateVariable(S_STENCIL_OPBACK, 'stencilOpSeparate',
    [GL_BACK, GL_KEEP, GL_KEEP, GL_KEEP]);

  // Scissor
  stateFlag(S_SCISSOR_ENABLE, GL_SCISSOR_TEST);
  stateVariable(S_SCISSOR_BOX, 'scissor',
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // Viewport
  stateVariable(S_VIEWPORT, S_VIEWPORT,
    [0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight]);

  // ===================================================
  // ===================================================
  // ENVIRONMENT
  // ===================================================
  // ===================================================
  var sharedState = {
    gl: gl,
    context: contextState,
    strings: stringStore,
    next: nextState,
    current: currentState,
    draw: drawState,
    elements: elementState,
    buffer: bufferState,
    shader: shaderState,
    attributes: attributeState.state,
    uniforms: uniformState,
    framebuffer: framebufferState,
    extensions: extensions,

    timer: timer,
    isBufferArgs: isBufferArgs
  };

  var sharedConstants = {
    primTypes: primTypes,
    compareFuncs: compareFuncs,
    blendFuncs: blendFuncs,
    blendEquations: blendEquations,
    stencilOps: stencilOps,
    glTypes: glTypes,
    orientationType: orientationType
  };

  check$1.optional(function () {
    sharedState.isArrayLike = isArrayLike;
  });

  if (extDrawBuffers) {
    sharedConstants.backBuffer = [GL_BACK];
    sharedConstants.drawBuffer = loop(limits.maxDrawbuffers, function (i) {
      if (i === 0) {
        return [0]
      }
      return loop(i, function (j) {
        return GL_COLOR_ATTACHMENT0$1 + j
      })
    });
  }

  var drawCallCounter = 0;
  function createREGLEnvironment () {
    var env = createEnvironment();
    var link = env.link;
    var global = env.global;
    env.id = drawCallCounter++;

    env.batchId = '0';

    // link shared state
    var SHARED = link(sharedState);
    var shared = env.shared = {
      props: 'a0'
    };
    Object.keys(sharedState).forEach(function (prop) {
      shared[prop] = global.def(SHARED, '.', prop);
    });

    // Inject runtime assertion stuff for debug builds
    check$1.optional(function () {
      env.CHECK = link(check$1);
      env.commandStr = check$1.guessCommand();
      env.command = link(env.commandStr);
      env.assert = function (block, pred, message) {
        block(
          'if(!(', pred, '))',
          this.CHECK, '.commandRaise(', link(message), ',', this.command, ');');
      };

      sharedConstants.invalidBlendCombinations = invalidBlendCombinations;
    });

    // Copy GL state variables over
    var nextVars = env.next = {};
    var currentVars = env.current = {};
    Object.keys(GL_VARIABLES).forEach(function (variable) {
      if (Array.isArray(currentState[variable])) {
        nextVars[variable] = global.def(shared.next, '.', variable);
        currentVars[variable] = global.def(shared.current, '.', variable);
      }
    });

    // Initialize shared constants
    var constants = env.constants = {};
    Object.keys(sharedConstants).forEach(function (name) {
      constants[name] = global.def(JSON.stringify(sharedConstants[name]));
    });

    // Helper function for calling a block
    env.invoke = function (block, x) {
      switch (x.type) {
        case DYN_FUNC$1:
          var argList = [
            'this',
            shared.context,
            shared.props,
            env.batchId
          ];
          return block.def(
            link(x.data), '.call(',
              argList.slice(0, Math.max(x.data.length + 1, 4)),
             ')')
        case DYN_PROP$1:
          return block.def(shared.props, x.data)
        case DYN_CONTEXT$1:
          return block.def(shared.context, x.data)
        case DYN_STATE$1:
          return block.def('this', x.data)
        case DYN_THUNK:
          x.data.append(env, block);
          return x.data.ref
      }
    };

    env.attribCache = {};

    var scopeAttribs = {};
    env.scopeAttrib = function (name) {
      var id = stringStore.id(name);
      if (id in scopeAttribs) {
        return scopeAttribs[id]
      }
      var binding = attributeState.scope[id];
      if (!binding) {
        binding = attributeState.scope[id] = new AttributeRecord();
      }
      var result = scopeAttribs[id] = link(binding);
      return result
    };

    return env
  }

  // ===================================================
  // ===================================================
  // PARSING
  // ===================================================
  // ===================================================
  function parseProfile (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var profileEnable;
    if (S_PROFILE in staticOptions) {
      var value = !!staticOptions[S_PROFILE];
      profileEnable = createStaticDecl(function (env, scope) {
        return value
      });
      profileEnable.enable = value;
    } else if (S_PROFILE in dynamicOptions) {
      var dyn = dynamicOptions[S_PROFILE];
      profileEnable = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    }

    return profileEnable
  }

  function parseFramebuffer (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    if (S_FRAMEBUFFER in staticOptions) {
      var framebuffer = staticOptions[S_FRAMEBUFFER];
      if (framebuffer) {
        framebuffer = framebufferState.getFramebuffer(framebuffer);
        check$1.command(framebuffer, 'invalid framebuffer object');
        return createStaticDecl(function (env, block) {
          var FRAMEBUFFER = env.link(framebuffer);
          var shared = env.shared;
          block.set(
            shared.framebuffer,
            '.next',
            FRAMEBUFFER);
          var CONTEXT = shared.context;
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            FRAMEBUFFER + '.width');
          block.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            FRAMEBUFFER + '.height');
          return FRAMEBUFFER
        })
      } else {
        return createStaticDecl(function (env, scope) {
          var shared = env.shared;
          scope.set(
            shared.framebuffer,
            '.next',
            'null');
          var CONTEXT = shared.context;
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_WIDTH,
            CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
          scope.set(
            CONTEXT,
            '.' + S_FRAMEBUFFER_HEIGHT,
            CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
          return 'null'
        })
      }
    } else if (S_FRAMEBUFFER in dynamicOptions) {
      var dyn = dynamicOptions[S_FRAMEBUFFER];
      return createDynamicDecl(dyn, function (env, scope) {
        var FRAMEBUFFER_FUNC = env.invoke(scope, dyn);
        var shared = env.shared;
        var FRAMEBUFFER_STATE = shared.framebuffer;
        var FRAMEBUFFER = scope.def(
          FRAMEBUFFER_STATE, '.getFramebuffer(', FRAMEBUFFER_FUNC, ')');

        check$1.optional(function () {
          env.assert(scope,
            '!' + FRAMEBUFFER_FUNC + '||' + FRAMEBUFFER,
            'invalid framebuffer object');
        });

        scope.set(
          FRAMEBUFFER_STATE,
          '.next',
          FRAMEBUFFER);
        var CONTEXT = shared.context;
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_WIDTH,
          FRAMEBUFFER + '?' + FRAMEBUFFER + '.width:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_WIDTH);
        scope.set(
          CONTEXT,
          '.' + S_FRAMEBUFFER_HEIGHT,
          FRAMEBUFFER +
          '?' + FRAMEBUFFER + '.height:' +
          CONTEXT + '.' + S_DRAWINGBUFFER_HEIGHT);
        return FRAMEBUFFER
      })
    } else {
      return null
    }
  }

  function parseViewportScissor (options, framebuffer, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseBox (param) {
      if (param in staticOptions) {
        var box = staticOptions[param];
        check$1.commandType(box, 'object', 'invalid ' + param, env.commandStr);

        var isStatic = true;
        var x = box.x | 0;
        var y = box.y | 0;
        var w, h;
        if ('width' in box) {
          w = box.width | 0;
          check$1.command(w >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }
        if ('height' in box) {
          h = box.height | 0;
          check$1.command(h >= 0, 'invalid ' + param, env.commandStr);
        } else {
          isStatic = false;
        }

        return new Declaration(
          !isStatic && framebuffer && framebuffer.thisDep,
          !isStatic && framebuffer && framebuffer.contextDep,
          !isStatic && framebuffer && framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            var BOX_W = w;
            if (!('width' in box)) {
              BOX_W = scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', x);
            }
            var BOX_H = h;
            if (!('height' in box)) {
              BOX_H = scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', y);
            }
            return [x, y, BOX_W, BOX_H]
          })
      } else if (param in dynamicOptions) {
        var dynBox = dynamicOptions[param];
        var result = createDynamicDecl(dynBox, function (env, scope) {
          var BOX = env.invoke(scope, dynBox);

          check$1.optional(function () {
            env.assert(scope,
              BOX + '&&typeof ' + BOX + '==="object"',
              'invalid ' + param);
          });

          var CONTEXT = env.shared.context;
          var BOX_X = scope.def(BOX, '.x|0');
          var BOX_Y = scope.def(BOX, '.y|0');
          var BOX_W = scope.def(
            '"width" in ', BOX, '?', BOX, '.width|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_WIDTH, '-', BOX_X, ')');
          var BOX_H = scope.def(
            '"height" in ', BOX, '?', BOX, '.height|0:',
            '(', CONTEXT, '.', S_FRAMEBUFFER_HEIGHT, '-', BOX_Y, ')');

          check$1.optional(function () {
            env.assert(scope,
              BOX_W + '>=0&&' +
              BOX_H + '>=0',
              'invalid ' + param);
          });

          return [BOX_X, BOX_Y, BOX_W, BOX_H]
        });
        if (framebuffer) {
          result.thisDep = result.thisDep || framebuffer.thisDep;
          result.contextDep = result.contextDep || framebuffer.contextDep;
          result.propDep = result.propDep || framebuffer.propDep;
        }
        return result
      } else if (framebuffer) {
        return new Declaration(
          framebuffer.thisDep,
          framebuffer.contextDep,
          framebuffer.propDep,
          function (env, scope) {
            var CONTEXT = env.shared.context;
            return [
              0, 0,
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_WIDTH),
              scope.def(CONTEXT, '.', S_FRAMEBUFFER_HEIGHT)]
          })
      } else {
        return null
      }
    }

    var viewport = parseBox(S_VIEWPORT);

    if (viewport) {
      var prevViewport = viewport;
      viewport = new Declaration(
        viewport.thisDep,
        viewport.contextDep,
        viewport.propDep,
        function (env, scope) {
          var VIEWPORT = prevViewport.append(env, scope);
          var CONTEXT = env.shared.context;
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_WIDTH,
            VIEWPORT[2]);
          scope.set(
            CONTEXT,
            '.' + S_VIEWPORT_HEIGHT,
            VIEWPORT[3]);
          return VIEWPORT
        });
    }

    return {
      viewport: viewport,
      scissor_box: parseBox(S_SCISSOR_BOX)
    }
  }

  function parseProgram (options) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseShader (name) {
      if (name in staticOptions) {
        var id = stringStore.id(staticOptions[name]);
        check$1.optional(function () {
          shaderState.shader(shaderType[name], id, check$1.guessCommand());
        });
        var result = createStaticDecl(function () {
          return id
        });
        result.id = id;
        return result
      } else if (name in dynamicOptions) {
        var dyn = dynamicOptions[name];
        return createDynamicDecl(dyn, function (env, scope) {
          var str = env.invoke(scope, dyn);
          var id = scope.def(env.shared.strings, '.id(', str, ')');
          check$1.optional(function () {
            scope(
              env.shared.shader, '.shader(',
              shaderType[name], ',',
              id, ',',
              env.command, ');');
          });
          return id
        })
      }
      return null
    }

    var frag = parseShader(S_FRAG);
    var vert = parseShader(S_VERT);

    var program = null;
    var progVar;
    if (isStatic(frag) && isStatic(vert)) {
      program = shaderState.program(vert.id, frag.id);
      progVar = createStaticDecl(function (env, scope) {
        return env.link(program)
      });
    } else {
      progVar = new Declaration(
        (frag && frag.thisDep) || (vert && vert.thisDep),
        (frag && frag.contextDep) || (vert && vert.contextDep),
        (frag && frag.propDep) || (vert && vert.propDep),
        function (env, scope) {
          var SHADER_STATE = env.shared.shader;
          var fragId;
          if (frag) {
            fragId = frag.append(env, scope);
          } else {
            fragId = scope.def(SHADER_STATE, '.', S_FRAG);
          }
          var vertId;
          if (vert) {
            vertId = vert.append(env, scope);
          } else {
            vertId = scope.def(SHADER_STATE, '.', S_VERT);
          }
          var progDef = SHADER_STATE + '.program(' + vertId + ',' + fragId;
          check$1.optional(function () {
            progDef += ',' + env.command;
          });
          return scope.def(progDef + ')')
        });
    }

    return {
      frag: frag,
      vert: vert,
      progVar: progVar,
      program: program
    }
  }

  function parseDraw (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    function parseElements () {
      if (S_ELEMENTS in staticOptions) {
        var elements = staticOptions[S_ELEMENTS];
        if (isBufferArgs(elements)) {
          elements = elementState.getElements(elementState.create(elements, true));
        } else if (elements) {
          elements = elementState.getElements(elements);
          check$1.command(elements, 'invalid elements', env.commandStr);
        }
        var result = createStaticDecl(function (env, scope) {
          if (elements) {
            var result = env.link(elements);
            env.ELEMENTS = result;
            return result
          }
          env.ELEMENTS = null;
          return null
        });
        result.value = elements;
        return result
      } else if (S_ELEMENTS in dynamicOptions) {
        var dyn = dynamicOptions[S_ELEMENTS];
        return createDynamicDecl(dyn, function (env, scope) {
          var shared = env.shared;

          var IS_BUFFER_ARGS = shared.isBufferArgs;
          var ELEMENT_STATE = shared.elements;

          var elementDefn = env.invoke(scope, dyn);
          var elements = scope.def('null');
          var elementStream = scope.def(IS_BUFFER_ARGS, '(', elementDefn, ')');

          var ifte = env.cond(elementStream)
            .then(elements, '=', ELEMENT_STATE, '.createStream(', elementDefn, ');')
            .else(elements, '=', ELEMENT_STATE, '.getElements(', elementDefn, ');');

          check$1.optional(function () {
            env.assert(ifte.else,
              '!' + elementDefn + '||' + elements,
              'invalid elements');
          });

          scope.entry(ifte);
          scope.exit(
            env.cond(elementStream)
              .then(ELEMENT_STATE, '.destroyStream(', elements, ');'));

          env.ELEMENTS = elements;

          return elements
        })
      }

      return null
    }

    var elements = parseElements();

    function parsePrimitive () {
      if (S_PRIMITIVE in staticOptions) {
        var primitive = staticOptions[S_PRIMITIVE];
        check$1.commandParameter(primitive, primTypes, 'invalid primitve', env.commandStr);
        return createStaticDecl(function (env, scope) {
          return primTypes[primitive]
        })
      } else if (S_PRIMITIVE in dynamicOptions) {
        var dynPrimitive = dynamicOptions[S_PRIMITIVE];
        return createDynamicDecl(dynPrimitive, function (env, scope) {
          var PRIM_TYPES = env.constants.primTypes;
          var prim = env.invoke(scope, dynPrimitive);
          check$1.optional(function () {
            env.assert(scope,
              prim + ' in ' + PRIM_TYPES,
              'invalid primitive, must be one of ' + Object.keys(primTypes));
          });
          return scope.def(PRIM_TYPES, '[', prim, ']')
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements.value) {
            return createStaticDecl(function (env, scope) {
              return scope.def(env.ELEMENTS, '.primType')
            })
          } else {
            return createStaticDecl(function () {
              return GL_TRIANGLES$1
            })
          }
        } else {
          return new Declaration(
            elements.thisDep,
            elements.contextDep,
            elements.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              return scope.def(elements, '?', elements, '.primType:', GL_TRIANGLES$1)
            })
        }
      }
      return null
    }

    function parseParam (param, isOffset) {
      if (param in staticOptions) {
        var value = staticOptions[param] | 0;
        check$1.command(!isOffset || value >= 0, 'invalid ' + param, env.commandStr);
        return createStaticDecl(function (env, scope) {
          if (isOffset) {
            env.OFFSET = value;
          }
          return value
        })
      } else if (param in dynamicOptions) {
        var dynValue = dynamicOptions[param];
        return createDynamicDecl(dynValue, function (env, scope) {
          var result = env.invoke(scope, dynValue);
          if (isOffset) {
            env.OFFSET = result;
            check$1.optional(function () {
              env.assert(scope,
                result + '>=0',
                'invalid ' + param);
            });
          }
          return result
        })
      } else if (isOffset && elements) {
        return createStaticDecl(function (env, scope) {
          env.OFFSET = '0';
          return 0
        })
      }
      return null
    }

    var OFFSET = parseParam(S_OFFSET, true);

    function parseVertCount () {
      if (S_COUNT in staticOptions) {
        var count = staticOptions[S_COUNT] | 0;
        check$1.command(
          typeof count === 'number' && count >= 0, 'invalid vertex count', env.commandStr);
        return createStaticDecl(function () {
          return count
        })
      } else if (S_COUNT in dynamicOptions) {
        var dynCount = dynamicOptions[S_COUNT];
        return createDynamicDecl(dynCount, function (env, scope) {
          var result = env.invoke(scope, dynCount);
          check$1.optional(function () {
            env.assert(scope,
              'typeof ' + result + '==="number"&&' +
              result + '>=0&&' +
              result + '===(' + result + '|0)',
              'invalid vertex count');
          });
          return result
        })
      } else if (elements) {
        if (isStatic(elements)) {
          if (elements) {
            if (OFFSET) {
              return new Declaration(
                OFFSET.thisDep,
                OFFSET.contextDep,
                OFFSET.propDep,
                function (env, scope) {
                  var result = scope.def(
                    env.ELEMENTS, '.vertCount-', env.OFFSET);

                  check$1.optional(function () {
                    env.assert(scope,
                      result + '>=0',
                      'invalid vertex offset/element buffer too small');
                  });

                  return result
                })
            } else {
              return createStaticDecl(function (env, scope) {
                return scope.def(env.ELEMENTS, '.vertCount')
              })
            }
          } else {
            var result = createStaticDecl(function () {
              return -1
            });
            check$1.optional(function () {
              result.MISSING = true;
            });
            return result
          }
        } else {
          var variable = new Declaration(
            elements.thisDep || OFFSET.thisDep,
            elements.contextDep || OFFSET.contextDep,
            elements.propDep || OFFSET.propDep,
            function (env, scope) {
              var elements = env.ELEMENTS;
              if (env.OFFSET) {
                return scope.def(elements, '?', elements, '.vertCount-',
                  env.OFFSET, ':-1')
              }
              return scope.def(elements, '?', elements, '.vertCount:-1')
            });
          check$1.optional(function () {
            variable.DYNAMIC = true;
          });
          return variable
        }
      }
      return null
    }

    return {
      elements: elements,
      primitive: parsePrimitive(),
      count: parseVertCount(),
      instances: parseParam(S_INSTANCES, false),
      offset: OFFSET
    }
  }

  function parseGLState (options, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    var STATE = {};

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);

      function parseParam (parseStatic, parseDynamic) {
        if (prop in staticOptions) {
          var value = parseStatic(staticOptions[prop]);
          STATE[param] = createStaticDecl(function () {
            return value
          });
        } else if (prop in dynamicOptions) {
          var dyn = dynamicOptions[prop];
          STATE[param] = createDynamicDecl(dyn, function (env, scope) {
            return parseDynamic(env, scope, env.invoke(scope, dyn))
          });
        }
      }

      switch (prop) {
        case S_CULL_ENABLE:
        case S_BLEND_ENABLE:
        case S_DITHER:
        case S_STENCIL_ENABLE:
        case S_DEPTH_ENABLE:
        case S_SCISSOR_ENABLE:
        case S_POLYGON_OFFSET_ENABLE:
        case S_SAMPLE_ALPHA:
        case S_SAMPLE_ENABLE:
        case S_DEPTH_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'boolean', prop, env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="boolean"',
                  'invalid flag ' + prop, env.commandStr);
              });
              return value
            })

        case S_DEPTH_FUNC:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, compareFuncs, 'invalid ' + prop, env.commandStr);
              return compareFuncs[value]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                env.assert(scope,
                  value + ' in ' + COMPARE_FUNCS,
                  'invalid ' + prop + ', must be one of ' + Object.keys(compareFuncs));
              });
              return scope.def(COMPARE_FUNCS, '[', value, ']')
            })

        case S_DEPTH_RANGE:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 2 &&
                typeof value[0] === 'number' &&
                typeof value[1] === 'number' &&
                value[0] <= value[1],
                'depth range is 2d array',
                env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===2&&' +
                  'typeof ' + value + '[0]==="number"&&' +
                  'typeof ' + value + '[1]==="number"&&' +
                  value + '[0]<=' + value + '[1]',
                  'depth range must be a 2d array');
              });

              var Z_NEAR = scope.def('+', value, '[0]');
              var Z_FAR = scope.def('+', value, '[1]');
              return [Z_NEAR, Z_FAR]
            })

        case S_BLEND_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', 'blend.func', env.commandStr);
              var srcRGB = ('srcRGB' in value ? value.srcRGB : value.src);
              var srcAlpha = ('srcAlpha' in value ? value.srcAlpha : value.src);
              var dstRGB = ('dstRGB' in value ? value.dstRGB : value.dst);
              var dstAlpha = ('dstAlpha' in value ? value.dstAlpha : value.dst);
              check$1.commandParameter(srcRGB, blendFuncs, param + '.srcRGB', env.commandStr);
              check$1.commandParameter(srcAlpha, blendFuncs, param + '.srcAlpha', env.commandStr);
              check$1.commandParameter(dstRGB, blendFuncs, param + '.dstRGB', env.commandStr);
              check$1.commandParameter(dstAlpha, blendFuncs, param + '.dstAlpha', env.commandStr);

              check$1.command(
                (invalidBlendCombinations.indexOf(srcRGB + ', ' + dstRGB) === -1),
                'unallowed blending combination (srcRGB, dstRGB) = (' + srcRGB + ', ' + dstRGB + ')', env.commandStr);

              return [
                blendFuncs[srcRGB],
                blendFuncs[dstRGB],
                blendFuncs[srcAlpha],
                blendFuncs[dstAlpha]
              ]
            },
            function (env, scope, value) {
              var BLEND_FUNCS = env.constants.blendFuncs;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid blend func, must be an object');
              });

              function read (prefix, suffix) {
                var func = scope.def(
                  '"', prefix, suffix, '" in ', value,
                  '?', value, '.', prefix, suffix,
                  ':', value, '.', prefix);

                check$1.optional(function () {
                  env.assert(scope,
                    func + ' in ' + BLEND_FUNCS,
                    'invalid ' + prop + '.' + prefix + suffix + ', must be one of ' + Object.keys(blendFuncs));
                });

                return func
              }

              var srcRGB = read('src', 'RGB');
              var dstRGB = read('dst', 'RGB');

              check$1.optional(function () {
                var INVALID_BLEND_COMBINATIONS = env.constants.invalidBlendCombinations;

                env.assert(scope,
                           INVALID_BLEND_COMBINATIONS +
                           '.indexOf(' + srcRGB + '+", "+' + dstRGB + ') === -1 ',
                           'unallowed blending combination for (srcRGB, dstRGB)'
                          );
              });

              var SRC_RGB = scope.def(BLEND_FUNCS, '[', srcRGB, ']');
              var SRC_ALPHA = scope.def(BLEND_FUNCS, '[', read('src', 'Alpha'), ']');
              var DST_RGB = scope.def(BLEND_FUNCS, '[', dstRGB, ']');
              var DST_ALPHA = scope.def(BLEND_FUNCS, '[', read('dst', 'Alpha'), ']');

              return [SRC_RGB, DST_RGB, SRC_ALPHA, DST_ALPHA]
            })

        case S_BLEND_EQUATION:
          return parseParam(
            function (value) {
              if (typeof value === 'string') {
                check$1.commandParameter(value, blendEquations, 'invalid ' + prop, env.commandStr);
                return [
                  blendEquations[value],
                  blendEquations[value]
                ]
              } else if (typeof value === 'object') {
                check$1.commandParameter(
                  value.rgb, blendEquations, prop + '.rgb', env.commandStr);
                check$1.commandParameter(
                  value.alpha, blendEquations, prop + '.alpha', env.commandStr);
                return [
                  blendEquations[value.rgb],
                  blendEquations[value.alpha]
                ]
              } else {
                check$1.commandRaise('invalid blend.equation', env.commandStr);
              }
            },
            function (env, scope, value) {
              var BLEND_EQUATIONS = env.constants.blendEquations;

              var RGB = scope.def();
              var ALPHA = scope.def();

              var ifte = env.cond('typeof ', value, '==="string"');

              check$1.optional(function () {
                function checkProp (block, name, value) {
                  env.assert(block,
                    value + ' in ' + BLEND_EQUATIONS,
                    'invalid ' + name + ', must be one of ' + Object.keys(blendEquations));
                }
                checkProp(ifte.then, prop, value);

                env.assert(ifte.else,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
                checkProp(ifte.else, prop + '.rgb', value + '.rgb');
                checkProp(ifte.else, prop + '.alpha', value + '.alpha');
              });

              ifte.then(
                RGB, '=', ALPHA, '=', BLEND_EQUATIONS, '[', value, '];');
              ifte.else(
                RGB, '=', BLEND_EQUATIONS, '[', value, '.rgb];',
                ALPHA, '=', BLEND_EQUATIONS, '[', value, '.alpha];');

              scope(ifte);

              return [RGB, ALPHA]
            })

        case S_BLEND_COLOR:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) &&
                value.length === 4,
                'blend.color must be a 4d array', env.commandStr);
              return loop(4, function (i) {
                return +value[i]
              })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'blend.color must be a 4d array');
              });
              return loop(4, function (i) {
                return scope.def('+', value, '[', i, ']')
              })
            })

        case S_STENCIL_MASK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'number', param, env.commandStr);
              return value | 0
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"',
                  'invalid stencil.mask');
              });
              return scope.def(value, '|0')
            })

        case S_STENCIL_FUNC:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var cmp = value.cmp || 'keep';
              var ref = value.ref || 0;
              var mask = 'mask' in value ? value.mask : -1;
              check$1.commandParameter(cmp, compareFuncs, prop + '.cmp', env.commandStr);
              check$1.commandType(ref, 'number', prop + '.ref', env.commandStr);
              check$1.commandType(mask, 'number', prop + '.mask', env.commandStr);
              return [
                compareFuncs[cmp],
                ref,
                mask
              ]
            },
            function (env, scope, value) {
              var COMPARE_FUNCS = env.constants.compareFuncs;
              check$1.optional(function () {
                function assert () {
                  env.assert(scope,
                    Array.prototype.join.call(arguments, ''),
                    'invalid stencil.func');
                }
                assert(value + '&&typeof ', value, '==="object"');
                assert('!("cmp" in ', value, ')||(',
                  value, '.cmp in ', COMPARE_FUNCS, ')');
              });
              var cmp = scope.def(
                '"cmp" in ', value,
                '?', COMPARE_FUNCS, '[', value, '.cmp]',
                ':', GL_KEEP);
              var ref = scope.def(value, '.ref|0');
              var mask = scope.def(
                '"mask" in ', value,
                '?', value, '.mask|0:-1');
              return [cmp, ref, mask]
            })

        case S_STENCIL_OPFRONT:
        case S_STENCIL_OPBACK:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var fail = value.fail || 'keep';
              var zfail = value.zfail || 'keep';
              var zpass = value.zpass || 'keep';
              check$1.commandParameter(fail, stencilOps, prop + '.fail', env.commandStr);
              check$1.commandParameter(zfail, stencilOps, prop + '.zfail', env.commandStr);
              check$1.commandParameter(zpass, stencilOps, prop + '.zpass', env.commandStr);
              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                stencilOps[fail],
                stencilOps[zfail],
                stencilOps[zpass]
              ]
            },
            function (env, scope, value) {
              var STENCIL_OPS = env.constants.stencilOps;

              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              function read (name) {
                check$1.optional(function () {
                  env.assert(scope,
                    '!("' + name + '" in ' + value + ')||' +
                    '(' + value + '.' + name + ' in ' + STENCIL_OPS + ')',
                    'invalid ' + prop + '.' + name + ', must be one of ' + Object.keys(stencilOps));
                });

                return scope.def(
                  '"', name, '" in ', value,
                  '?', STENCIL_OPS, '[', value, '.', name, ']:',
                  GL_KEEP)
              }

              return [
                prop === S_STENCIL_OPBACK ? GL_BACK : GL_FRONT,
                read('fail'),
                read('zfail'),
                read('zpass')
              ]
            })

        case S_POLYGON_OFFSET_OFFSET:
          return parseParam(
            function (value) {
              check$1.commandType(value, 'object', param, env.commandStr);
              var factor = value.factor | 0;
              var units = value.units | 0;
              check$1.commandType(factor, 'number', param + '.factor', env.commandStr);
              check$1.commandType(units, 'number', param + '.units', env.commandStr);
              return [factor, units]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid ' + prop);
              });

              var FACTOR = scope.def(value, '.factor|0');
              var UNITS = scope.def(value, '.units|0');

              return [FACTOR, UNITS]
            })

        case S_CULL_FACE:
          return parseParam(
            function (value) {
              var face = 0;
              if (value === 'front') {
                face = GL_FRONT;
              } else if (value === 'back') {
                face = GL_BACK;
              }
              check$1.command(!!face, param, env.commandStr);
              return face
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="front"||' +
                  value + '==="back"',
                  'invalid cull.face');
              });
              return scope.def(value, '==="front"?', GL_FRONT, ':', GL_BACK)
            })

        case S_LINE_WIDTH:
          return parseParam(
            function (value) {
              check$1.command(
                typeof value === 'number' &&
                value >= limits.lineWidthDims[0] &&
                value <= limits.lineWidthDims[1],
                'invalid line width, must positive number between ' +
                limits.lineWidthDims[0] + ' and ' + limits.lineWidthDims[1], env.commandStr);
              return value
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  'typeof ' + value + '==="number"&&' +
                  value + '>=' + limits.lineWidthDims[0] + '&&' +
                  value + '<=' + limits.lineWidthDims[1],
                  'invalid line width');
              });

              return value
            })

        case S_FRONT_FACE:
          return parseParam(
            function (value) {
              check$1.commandParameter(value, orientationType, param, env.commandStr);
              return orientationType[value]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '==="cw"||' +
                  value + '==="ccw"',
                  'invalid frontFace, must be one of cw,ccw');
              });
              return scope.def(value + '==="cw"?' + GL_CW + ':' + GL_CCW)
            })

        case S_COLOR_MASK:
          return parseParam(
            function (value) {
              check$1.command(
                isArrayLike(value) && value.length === 4,
                'color.mask must be length 4 array', env.commandStr);
              return value.map(function (v) { return !!v })
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  env.shared.isArrayLike + '(' + value + ')&&' +
                  value + '.length===4',
                  'invalid color.mask');
              });
              return loop(4, function (i) {
                return '!!' + value + '[' + i + ']'
              })
            })

        case S_SAMPLE_COVERAGE:
          return parseParam(
            function (value) {
              check$1.command(typeof value === 'object' && value, param, env.commandStr);
              var sampleValue = 'value' in value ? value.value : 1;
              var sampleInvert = !!value.invert;
              check$1.command(
                typeof sampleValue === 'number' &&
                sampleValue >= 0 && sampleValue <= 1,
                'sample.coverage.value must be a number between 0 and 1', env.commandStr);
              return [sampleValue, sampleInvert]
            },
            function (env, scope, value) {
              check$1.optional(function () {
                env.assert(scope,
                  value + '&&typeof ' + value + '==="object"',
                  'invalid sample.coverage');
              });
              var VALUE = scope.def(
                '"value" in ', value, '?+', value, '.value:1');
              var INVERT = scope.def('!!', value, '.invert');
              return [VALUE, INVERT]
            })
      }
    });

    return STATE
  }

  function parseUniforms (uniforms, env) {
    var staticUniforms = uniforms.static;
    var dynamicUniforms = uniforms.dynamic;

    var UNIFORMS = {};

    Object.keys(staticUniforms).forEach(function (name) {
      var value = staticUniforms[name];
      var result;
      if (typeof value === 'number' ||
          typeof value === 'boolean') {
        result = createStaticDecl(function () {
          return value
        });
      } else if (typeof value === 'function') {
        var reglType = value._reglType;
        if (reglType === 'texture2d' ||
            reglType === 'textureCube') {
          result = createStaticDecl(function (env) {
            return env.link(value)
          });
        } else if (reglType === 'framebuffer' ||
                   reglType === 'framebufferCube') {
          check$1.command(value.color.length > 0,
            'missing color attachment for framebuffer sent to uniform "' + name + '"', env.commandStr);
          result = createStaticDecl(function (env) {
            return env.link(value.color[0])
          });
        } else {
          check$1.commandRaise('invalid data for uniform "' + name + '"', env.commandStr);
        }
      } else if (isArrayLike(value)) {
        result = createStaticDecl(function (env) {
          var ITEM = env.global.def('[',
            loop(value.length, function (i) {
              check$1.command(
                typeof value[i] === 'number' ||
                typeof value[i] === 'boolean',
                'invalid uniform ' + name, env.commandStr);
              return value[i]
            }), ']');
          return ITEM
        });
      } else {
        check$1.commandRaise('invalid or missing data for uniform "' + name + '"', env.commandStr);
      }
      result.value = value;
      UNIFORMS[name] = result;
    });

    Object.keys(dynamicUniforms).forEach(function (key) {
      var dyn = dynamicUniforms[key];
      UNIFORMS[key] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return UNIFORMS
  }

  function parseAttributes (attributes, env) {
    var staticAttributes = attributes.static;
    var dynamicAttributes = attributes.dynamic;

    var attributeDefs = {};

    Object.keys(staticAttributes).forEach(function (attribute) {
      var value = staticAttributes[attribute];
      var id = stringStore.id(attribute);

      var record = new AttributeRecord();
      if (isBufferArgs(value)) {
        record.state = ATTRIB_STATE_POINTER;
        record.buffer = bufferState.getBuffer(
          bufferState.create(value, GL_ARRAY_BUFFER$1, false, true));
        record.type = 0;
      } else {
        var buffer = bufferState.getBuffer(value);
        if (buffer) {
          record.state = ATTRIB_STATE_POINTER;
          record.buffer = buffer;
          record.type = 0;
        } else {
          check$1.command(typeof value === 'object' && value,
            'invalid data for attribute ' + attribute, env.commandStr);
          if (value.constant) {
            var constant = value.constant;
            record.buffer = 'null';
            record.state = ATTRIB_STATE_CONSTANT;
            if (typeof constant === 'number') {
              record.x = constant;
            } else {
              check$1.command(
                isArrayLike(constant) &&
                constant.length > 0 &&
                constant.length <= 4,
                'invalid constant for attribute ' + attribute, env.commandStr);
              CUTE_COMPONENTS.forEach(function (c, i) {
                if (i < constant.length) {
                  record[c] = constant[i];
                }
              });
            }
          } else {
            if (isBufferArgs(value.buffer)) {
              buffer = bufferState.getBuffer(
                bufferState.create(value.buffer, GL_ARRAY_BUFFER$1, false, true));
            } else {
              buffer = bufferState.getBuffer(value.buffer);
            }
            check$1.command(!!buffer, 'missing buffer for attribute "' + attribute + '"', env.commandStr);

            var offset = value.offset | 0;
            check$1.command(offset >= 0,
              'invalid offset for attribute "' + attribute + '"', env.commandStr);

            var stride = value.stride | 0;
            check$1.command(stride >= 0 && stride < 256,
              'invalid stride for attribute "' + attribute + '", must be integer betweeen [0, 255]', env.commandStr);

            var size = value.size | 0;
            check$1.command(!('size' in value) || (size > 0 && size <= 4),
              'invalid size for attribute "' + attribute + '", must be 1,2,3,4', env.commandStr);

            var normalized = !!value.normalized;

            var type = 0;
            if ('type' in value) {
              check$1.commandParameter(
                value.type, glTypes,
                'invalid type for attribute ' + attribute, env.commandStr);
              type = glTypes[value.type];
            }

            var divisor = value.divisor | 0;
            if ('divisor' in value) {
              check$1.command(divisor === 0 || extInstancing,
                'cannot specify divisor for attribute "' + attribute + '", instancing not supported', env.commandStr);
              check$1.command(divisor >= 0,
                'invalid divisor for attribute "' + attribute + '"', env.commandStr);
            }

            check$1.optional(function () {
              var command = env.commandStr;

              var VALID_KEYS = [
                'buffer',
                'offset',
                'divisor',
                'normalized',
                'type',
                'size',
                'stride'
              ];

              Object.keys(value).forEach(function (prop) {
                check$1.command(
                  VALID_KEYS.indexOf(prop) >= 0,
                  'unknown parameter "' + prop + '" for attribute pointer "' + attribute + '" (valid parameters are ' + VALID_KEYS + ')',
                  command);
              });
            });

            record.buffer = buffer;
            record.state = ATTRIB_STATE_POINTER;
            record.size = size;
            record.normalized = normalized;
            record.type = type || buffer.dtype;
            record.offset = offset;
            record.stride = stride;
            record.divisor = divisor;
          }
        }
      }

      attributeDefs[attribute] = createStaticDecl(function (env, scope) {
        var cache = env.attribCache;
        if (id in cache) {
          return cache[id]
        }
        var result = {
          isStream: false
        };
        Object.keys(record).forEach(function (key) {
          result[key] = record[key];
        });
        if (record.buffer) {
          result.buffer = env.link(record.buffer);
          result.type = result.type || (result.buffer + '.dtype');
        }
        cache[id] = result;
        return result
      });
    });

    Object.keys(dynamicAttributes).forEach(function (attribute) {
      var dyn = dynamicAttributes[attribute];

      function appendAttributeCode (env, block) {
        var VALUE = env.invoke(block, dyn);

        var shared = env.shared;

        var IS_BUFFER_ARGS = shared.isBufferArgs;
        var BUFFER_STATE = shared.buffer;

        // Perform validation on attribute
        check$1.optional(function () {
          env.assert(block,
            VALUE + '&&(typeof ' + VALUE + '==="object"||typeof ' +
            VALUE + '==="function")&&(' +
            IS_BUFFER_ARGS + '(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + ')||' +
            BUFFER_STATE + '.getBuffer(' + VALUE + '.buffer)||' +
            IS_BUFFER_ARGS + '(' + VALUE + '.buffer)||' +
            '("constant" in ' + VALUE +
            '&&(typeof ' + VALUE + '.constant==="number"||' +
            shared.isArrayLike + '(' + VALUE + '.constant))))',
            'invalid dynamic attribute "' + attribute + '"');
        });

        // allocate names for result
        var result = {
          isStream: block.def(false)
        };
        var defaultRecord = new AttributeRecord();
        defaultRecord.state = ATTRIB_STATE_POINTER;
        Object.keys(defaultRecord).forEach(function (key) {
          result[key] = block.def('' + defaultRecord[key]);
        });

        var BUFFER = result.buffer;
        var TYPE = result.type;
        block(
          'if(', IS_BUFFER_ARGS, '(', VALUE, ')){',
          result.isStream, '=true;',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, ');',
          TYPE, '=', BUFFER, '.dtype;',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, ');',
          'if(', BUFFER, '){',
          TYPE, '=', BUFFER, '.dtype;',
          '}else if("constant" in ', VALUE, '){',
          result.state, '=', ATTRIB_STATE_CONSTANT, ';',
          'if(typeof ' + VALUE + '.constant === "number"){',
          result[CUTE_COMPONENTS[0]], '=', VALUE, '.constant;',
          CUTE_COMPONENTS.slice(1).map(function (n) {
            return result[n]
          }).join('='), '=0;',
          '}else{',
          CUTE_COMPONENTS.map(function (name, i) {
            return (
              result[name] + '=' + VALUE + '.constant.length>=' + i +
              '?' + VALUE + '.constant[' + i + ']:0;'
            )
          }).join(''),
          '}}else{',
          'if(', IS_BUFFER_ARGS, '(', VALUE, '.buffer)){',
          BUFFER, '=', BUFFER_STATE, '.createStream(', GL_ARRAY_BUFFER$1, ',', VALUE, '.buffer);',
          '}else{',
          BUFFER, '=', BUFFER_STATE, '.getBuffer(', VALUE, '.buffer);',
          '}',
          TYPE, '="type" in ', VALUE, '?',
          shared.glTypes, '[', VALUE, '.type]:', BUFFER, '.dtype;',
          result.normalized, '=!!', VALUE, '.normalized;');
        function emitReadRecord (name) {
          block(result[name], '=', VALUE, '.', name, '|0;');
        }
        emitReadRecord('size');
        emitReadRecord('offset');
        emitReadRecord('stride');
        emitReadRecord('divisor');

        block('}}');

        block.exit(
          'if(', result.isStream, '){',
          BUFFER_STATE, '.destroyStream(', BUFFER, ');',
          '}');

        return result
      }

      attributeDefs[attribute] = createDynamicDecl(dyn, appendAttributeCode);
    });

    return attributeDefs
  }

  function parseContext (context) {
    var staticContext = context.static;
    var dynamicContext = context.dynamic;
    var result = {};

    Object.keys(staticContext).forEach(function (name) {
      var value = staticContext[name];
      result[name] = createStaticDecl(function (env, scope) {
        if (typeof value === 'number' || typeof value === 'boolean') {
          return '' + value
        } else {
          return env.link(value)
        }
      });
    });

    Object.keys(dynamicContext).forEach(function (name) {
      var dyn = dynamicContext[name];
      result[name] = createDynamicDecl(dyn, function (env, scope) {
        return env.invoke(scope, dyn)
      });
    });

    return result
  }

  function parseArguments (options, attributes, uniforms, context, env) {
    var staticOptions = options.static;
    var dynamicOptions = options.dynamic;

    check$1.optional(function () {
      var KEY_NAMES = [
        S_FRAMEBUFFER,
        S_VERT,
        S_FRAG,
        S_ELEMENTS,
        S_PRIMITIVE,
        S_OFFSET,
        S_COUNT,
        S_INSTANCES,
        S_PROFILE
      ].concat(GL_STATE_NAMES);

      function checkKeys (dict) {
        Object.keys(dict).forEach(function (key) {
          check$1.command(
            KEY_NAMES.indexOf(key) >= 0,
            'unknown parameter "' + key + '"',
            env.commandStr);
        });
      }

      checkKeys(staticOptions);
      checkKeys(dynamicOptions);
    });

    var framebuffer = parseFramebuffer(options, env);
    var viewportAndScissor = parseViewportScissor(options, framebuffer, env);
    var draw = parseDraw(options, env);
    var state = parseGLState(options, env);
    var shader = parseProgram(options, env);

    function copyBox (name) {
      var defn = viewportAndScissor[name];
      if (defn) {
        state[name] = defn;
      }
    }
    copyBox(S_VIEWPORT);
    copyBox(propName(S_SCISSOR_BOX));

    var dirty = Object.keys(state).length > 0;

    var result = {
      framebuffer: framebuffer,
      draw: draw,
      shader: shader,
      state: state,
      dirty: dirty
    };

    result.profile = parseProfile(options, env);
    result.uniforms = parseUniforms(uniforms, env);
    result.attributes = parseAttributes(attributes, env);
    result.context = parseContext(context, env);
    return result
  }

  // ===================================================
  // ===================================================
  // COMMON UPDATE FUNCTIONS
  // ===================================================
  // ===================================================
  function emitContext (env, scope, context) {
    var shared = env.shared;
    var CONTEXT = shared.context;

    var contextEnter = env.scope();

    Object.keys(context).forEach(function (name) {
      scope.save(CONTEXT, '.' + name);
      var defn = context[name];
      contextEnter(CONTEXT, '.', name, '=', defn.append(env, scope), ';');
    });

    scope(contextEnter);
  }

  // ===================================================
  // ===================================================
  // COMMON DRAWING FUNCTIONS
  // ===================================================
  // ===================================================
  function emitPollFramebuffer (env, scope, framebuffer, skipCheck) {
    var shared = env.shared;

    var GL = shared.gl;
    var FRAMEBUFFER_STATE = shared.framebuffer;
    var EXT_DRAW_BUFFERS;
    if (extDrawBuffers) {
      EXT_DRAW_BUFFERS = scope.def(shared.extensions, '.webgl_draw_buffers');
    }

    var constants = env.constants;

    var DRAW_BUFFERS = constants.drawBuffer;
    var BACK_BUFFER = constants.backBuffer;

    var NEXT;
    if (framebuffer) {
      NEXT = framebuffer.append(env, scope);
    } else {
      NEXT = scope.def(FRAMEBUFFER_STATE, '.next');
    }

    if (!skipCheck) {
      scope('if(', NEXT, '!==', FRAMEBUFFER_STATE, '.cur){');
    }
    scope(
      'if(', NEXT, '){',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$1, ',', NEXT, '.framebuffer);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(',
        DRAW_BUFFERS, '[', NEXT, '.colorAttachments.length]);');
    }
    scope('}else{',
      GL, '.bindFramebuffer(', GL_FRAMEBUFFER$1, ',null);');
    if (extDrawBuffers) {
      scope(EXT_DRAW_BUFFERS, '.drawBuffersWEBGL(', BACK_BUFFER, ');');
    }
    scope(
      '}',
      FRAMEBUFFER_STATE, '.cur=', NEXT, ';');
    if (!skipCheck) {
      scope('}');
    }
  }

  function emitPollState (env, scope, args) {
    var shared = env.shared;

    var GL = shared.gl;

    var CURRENT_VARS = env.current;
    var NEXT_VARS = env.next;
    var CURRENT_STATE = shared.current;
    var NEXT_STATE = shared.next;

    var block = env.cond(CURRENT_STATE, '.dirty');

    GL_STATE_NAMES.forEach(function (prop) {
      var param = propName(prop);
      if (param in args.state) {
        return
      }

      var NEXT, CURRENT;
      if (param in NEXT_VARS) {
        NEXT = NEXT_VARS[param];
        CURRENT = CURRENT_VARS[param];
        var parts = loop(currentState[param].length, function (i) {
          return block.def(NEXT, '[', i, ']')
        });
        block(env.cond(parts.map(function (p, i) {
          return p + '!==' + CURRENT + '[' + i + ']'
        }).join('||'))
          .then(
            GL, '.', GL_VARIABLES[param], '(', parts, ');',
            parts.map(function (p, i) {
              return CURRENT + '[' + i + ']=' + p
            }).join(';'), ';'));
      } else {
        NEXT = block.def(NEXT_STATE, '.', param);
        var ifte = env.cond(NEXT, '!==', CURRENT_STATE, '.', param);
        block(ifte);
        if (param in GL_FLAGS) {
          ifte(
            env.cond(NEXT)
                .then(GL, '.enable(', GL_FLAGS[param], ');')
                .else(GL, '.disable(', GL_FLAGS[param], ');'),
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        } else {
          ifte(
            GL, '.', GL_VARIABLES[param], '(', NEXT, ');',
            CURRENT_STATE, '.', param, '=', NEXT, ';');
        }
      }
    });
    if (Object.keys(args.state).length === 0) {
      block(CURRENT_STATE, '.dirty=false;');
    }
    scope(block);
  }

  function emitSetOptions (env, scope, options, filter) {
    var shared = env.shared;
    var CURRENT_VARS = env.current;
    var CURRENT_STATE = shared.current;
    var GL = shared.gl;
    sortState(Object.keys(options)).forEach(function (param) {
      var defn = options[param];
      if (filter && !filter(defn)) {
        return
      }
      var variable = defn.append(env, scope);
      if (GL_FLAGS[param]) {
        var flag = GL_FLAGS[param];
        if (isStatic(defn)) {
          if (variable) {
            scope(GL, '.enable(', flag, ');');
          } else {
            scope(GL, '.disable(', flag, ');');
          }
        } else {
          scope(env.cond(variable)
            .then(GL, '.enable(', flag, ');')
            .else(GL, '.disable(', flag, ');'));
        }
        scope(CURRENT_STATE, '.', param, '=', variable, ';');
      } else if (isArrayLike(variable)) {
        var CURRENT = CURRENT_VARS[param];
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          variable.map(function (v, i) {
            return CURRENT + '[' + i + ']=' + v
          }).join(';'), ';');
      } else {
        scope(
          GL, '.', GL_VARIABLES[param], '(', variable, ');',
          CURRENT_STATE, '.', param, '=', variable, ';');
      }
    });
  }

  function injectExtensions (env, scope) {
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
  }

  function emitProfile (env, scope, args, useScope, incrementCounter) {
    var shared = env.shared;
    var STATS = env.stats;
    var CURRENT_STATE = shared.current;
    var TIMER = shared.timer;
    var profileArg = args.profile;

    function perfCounter () {
      if (typeof performance === 'undefined') {
        return 'Date.now()'
      } else {
        return 'performance.now()'
      }
    }

    var CPU_START, QUERY_COUNTER;
    function emitProfileStart (block) {
      CPU_START = scope.def();
      block(CPU_START, '=', perfCounter(), ';');
      if (typeof incrementCounter === 'string') {
        block(STATS, '.count+=', incrementCounter, ';');
      } else {
        block(STATS, '.count++;');
      }
      if (timer) {
        if (useScope) {
          QUERY_COUNTER = scope.def();
          block(QUERY_COUNTER, '=', TIMER, '.getNumPendingQueries();');
        } else {
          block(TIMER, '.beginQuery(', STATS, ');');
        }
      }
    }

    function emitProfileEnd (block) {
      block(STATS, '.cpuTime+=', perfCounter(), '-', CPU_START, ';');
      if (timer) {
        if (useScope) {
          block(TIMER, '.pushScopeStats(',
            QUERY_COUNTER, ',',
            TIMER, '.getNumPendingQueries(),',
            STATS, ');');
        } else {
          block(TIMER, '.endQuery();');
        }
      }
    }

    function scopeProfile (value) {
      var prev = scope.def(CURRENT_STATE, '.profile');
      scope(CURRENT_STATE, '.profile=', value, ';');
      scope.exit(CURRENT_STATE, '.profile=', prev, ';');
    }

    var USE_PROFILE;
    if (profileArg) {
      if (isStatic(profileArg)) {
        if (profileArg.enable) {
          emitProfileStart(scope);
          emitProfileEnd(scope.exit);
          scopeProfile('true');
        } else {
          scopeProfile('false');
        }
        return
      }
      USE_PROFILE = profileArg.append(env, scope);
      scopeProfile(USE_PROFILE);
    } else {
      USE_PROFILE = scope.def(CURRENT_STATE, '.profile');
    }

    var start = env.block();
    emitProfileStart(start);
    scope('if(', USE_PROFILE, '){', start, '}');
    var end = env.block();
    emitProfileEnd(end);
    scope.exit('if(', USE_PROFILE, '){', end, '}');
  }

  function emitAttributes (env, scope, args, attributes, filter) {
    var shared = env.shared;

    function typeLength (x) {
      switch (x) {
        case GL_FLOAT_VEC2:
        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          return 2
        case GL_FLOAT_VEC3:
        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          return 3
        case GL_FLOAT_VEC4:
        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          return 4
        default:
          return 1
      }
    }

    function emitBindAttribute (ATTRIBUTE, size, record) {
      var GL = shared.gl;

      var LOCATION = scope.def(ATTRIBUTE, '.location');
      var BINDING = scope.def(shared.attributes, '[', LOCATION, ']');

      var STATE = record.state;
      var BUFFER = record.buffer;
      var CONST_COMPONENTS = [
        record.x,
        record.y,
        record.z,
        record.w
      ];

      var COMMON_KEYS = [
        'buffer',
        'normalized',
        'offset',
        'stride'
      ];

      function emitBuffer () {
        scope(
          'if(!', BINDING, '.buffer){',
          GL, '.enableVertexAttribArray(', LOCATION, ');}');

        var TYPE = record.type;
        var SIZE;
        if (!record.size) {
          SIZE = size;
        } else {
          SIZE = scope.def(record.size, '||', size);
        }

        scope('if(',
          BINDING, '.type!==', TYPE, '||',
          BINDING, '.size!==', SIZE, '||',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '!==' + record[key]
          }).join('||'),
          '){',
          GL, '.bindBuffer(', GL_ARRAY_BUFFER$1, ',', BUFFER, '.buffer);',
          GL, '.vertexAttribPointer(', [
            LOCATION,
            SIZE,
            TYPE,
            record.normalized,
            record.stride,
            record.offset
          ], ');',
          BINDING, '.type=', TYPE, ';',
          BINDING, '.size=', SIZE, ';',
          COMMON_KEYS.map(function (key) {
            return BINDING + '.' + key + '=' + record[key] + ';'
          }).join(''),
          '}');

        if (extInstancing) {
          var DIVISOR = record.divisor;
          scope(
            'if(', BINDING, '.divisor!==', DIVISOR, '){',
            env.instancing, '.vertexAttribDivisorANGLE(', [LOCATION, DIVISOR], ');',
            BINDING, '.divisor=', DIVISOR, ';}');
        }
      }

      function emitConstant () {
        scope(
          'if(', BINDING, '.buffer){',
          GL, '.disableVertexAttribArray(', LOCATION, ');',
          '}if(', CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '!==' + CONST_COMPONENTS[i]
          }).join('||'), '){',
          GL, '.vertexAttrib4f(', LOCATION, ',', CONST_COMPONENTS, ');',
          CUTE_COMPONENTS.map(function (c, i) {
            return BINDING + '.' + c + '=' + CONST_COMPONENTS[i] + ';'
          }).join(''),
          '}');
      }

      if (STATE === ATTRIB_STATE_POINTER) {
        emitBuffer();
      } else if (STATE === ATTRIB_STATE_CONSTANT) {
        emitConstant();
      } else {
        scope('if(', STATE, '===', ATTRIB_STATE_POINTER, '){');
        emitBuffer();
        scope('}else{');
        emitConstant();
        scope('}');
      }
    }

    attributes.forEach(function (attribute) {
      var name = attribute.name;
      var arg = args.attributes[name];
      var record;
      if (arg) {
        if (!filter(arg)) {
          return
        }
        record = arg.append(env, scope);
      } else {
        if (!filter(SCOPE_DECL)) {
          return
        }
        var scopeAttrib = env.scopeAttrib(name);
        check$1.optional(function () {
          env.assert(scope,
            scopeAttrib + '.state',
            'missing attribute ' + name);
        });
        record = {};
        Object.keys(new AttributeRecord()).forEach(function (key) {
          record[key] = scope.def(scopeAttrib, '.', key);
        });
      }
      emitBindAttribute(
        env.link(attribute), typeLength(attribute.info.type), record);
    });
  }

  function emitUniforms (env, scope, args, uniforms, filter) {
    var shared = env.shared;
    var GL = shared.gl;

    var infix;
    for (var i = 0; i < uniforms.length; ++i) {
      var uniform = uniforms[i];
      var name = uniform.name;
      var type = uniform.info.type;
      var arg = args.uniforms[name];
      var UNIFORM = env.link(uniform);
      var LOCATION = UNIFORM + '.location';

      var VALUE;
      if (arg) {
        if (!filter(arg)) {
          continue
        }
        if (isStatic(arg)) {
          var value = arg.value;
          check$1.command(
            value !== null && typeof value !== 'undefined',
            'missing uniform "' + name + '"', env.commandStr);
          if (type === GL_SAMPLER_2D || type === GL_SAMPLER_CUBE) {
            check$1.command(
              typeof value === 'function' &&
              ((type === GL_SAMPLER_2D &&
                (value._reglType === 'texture2d' ||
                value._reglType === 'framebuffer')) ||
              (type === GL_SAMPLER_CUBE &&
                (value._reglType === 'textureCube' ||
                value._reglType === 'framebufferCube'))),
              'invalid texture for uniform ' + name, env.commandStr);
            var TEX_VALUE = env.link(value._texture || value.color[0]._texture);
            scope(GL, '.uniform1i(', LOCATION, ',', TEX_VALUE + '.bind());');
            scope.exit(TEX_VALUE, '.unbind();');
          } else if (
            type === GL_FLOAT_MAT2 ||
            type === GL_FLOAT_MAT3 ||
            type === GL_FLOAT_MAT4) {
            check$1.optional(function () {
              check$1.command(isArrayLike(value),
                'invalid matrix for uniform ' + name, env.commandStr);
              check$1.command(
                (type === GL_FLOAT_MAT2 && value.length === 4) ||
                (type === GL_FLOAT_MAT3 && value.length === 9) ||
                (type === GL_FLOAT_MAT4 && value.length === 16),
                'invalid length for matrix uniform ' + name, env.commandStr);
            });
            var MAT_VALUE = env.global.def('new Float32Array([' +
              Array.prototype.slice.call(value) + '])');
            var dim = 2;
            if (type === GL_FLOAT_MAT3) {
              dim = 3;
            } else if (type === GL_FLOAT_MAT4) {
              dim = 4;
            }
            scope(
              GL, '.uniformMatrix', dim, 'fv(',
              LOCATION, ',false,', MAT_VALUE, ');');
          } else {
            switch (type) {
              case GL_FLOAT$7:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1f';
                break
              case GL_FLOAT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2f';
                break
              case GL_FLOAT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3f';
                break
              case GL_FLOAT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4f';
                break
              case GL_BOOL:
                check$1.commandType(value, 'boolean', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_INT$3:
                check$1.commandType(value, 'number', 'uniform ' + name, env.commandStr);
                infix = '1i';
                break
              case GL_BOOL_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_INT_VEC2:
                check$1.command(
                  isArrayLike(value) && value.length === 2,
                  'uniform ' + name, env.commandStr);
                infix = '2i';
                break
              case GL_BOOL_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_INT_VEC3:
                check$1.command(
                  isArrayLike(value) && value.length === 3,
                  'uniform ' + name, env.commandStr);
                infix = '3i';
                break
              case GL_BOOL_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
              case GL_INT_VEC4:
                check$1.command(
                  isArrayLike(value) && value.length === 4,
                  'uniform ' + name, env.commandStr);
                infix = '4i';
                break
            }
            scope(GL, '.uniform', infix, '(', LOCATION, ',',
              isArrayLike(value) ? Array.prototype.slice.call(value) : value,
              ');');
          }
          continue
        } else {
          VALUE = arg.append(env, scope);
        }
      } else {
        if (!filter(SCOPE_DECL)) {
          continue
        }
        VALUE = scope.def(shared.uniforms, '[', stringStore.id(name), ']');
      }

      if (type === GL_SAMPLER_2D) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebuffer"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      } else if (type === GL_SAMPLER_CUBE) {
        scope(
          'if(', VALUE, '&&', VALUE, '._reglType==="framebufferCube"){',
          VALUE, '=', VALUE, '.color[0];',
          '}');
      }

      // perform type validation
      check$1.optional(function () {
        function check (pred, message) {
          env.assert(scope, pred,
            'bad data or missing for uniform "' + name + '".  ' + message);
        }

        function checkType (type) {
          check(
            'typeof ' + VALUE + '==="' + type + '"',
            'invalid type, expected ' + type);
        }

        function checkVector (n, type) {
          check(
            shared.isArrayLike + '(' + VALUE + ')&&' + VALUE + '.length===' + n,
            'invalid vector, should have length ' + n, env.commandStr);
        }

        function checkTexture (target) {
          check(
            'typeof ' + VALUE + '==="function"&&' +
            VALUE + '._reglType==="texture' +
            (target === GL_TEXTURE_2D$2 ? '2d' : 'Cube') + '"',
            'invalid texture type', env.commandStr);
        }

        switch (type) {
          case GL_INT$3:
            checkType('number');
            break
          case GL_INT_VEC2:
            checkVector(2, 'number');
            break
          case GL_INT_VEC3:
            checkVector(3, 'number');
            break
          case GL_INT_VEC4:
            checkVector(4, 'number');
            break
          case GL_FLOAT$7:
            checkType('number');
            break
          case GL_FLOAT_VEC2:
            checkVector(2, 'number');
            break
          case GL_FLOAT_VEC3:
            checkVector(3, 'number');
            break
          case GL_FLOAT_VEC4:
            checkVector(4, 'number');
            break
          case GL_BOOL:
            checkType('boolean');
            break
          case GL_BOOL_VEC2:
            checkVector(2, 'boolean');
            break
          case GL_BOOL_VEC3:
            checkVector(3, 'boolean');
            break
          case GL_BOOL_VEC4:
            checkVector(4, 'boolean');
            break
          case GL_FLOAT_MAT2:
            checkVector(4, 'number');
            break
          case GL_FLOAT_MAT3:
            checkVector(9, 'number');
            break
          case GL_FLOAT_MAT4:
            checkVector(16, 'number');
            break
          case GL_SAMPLER_2D:
            checkTexture(GL_TEXTURE_2D$2);
            break
          case GL_SAMPLER_CUBE:
            checkTexture(GL_TEXTURE_CUBE_MAP$1);
            break
        }
      });

      var unroll = 1;
      switch (type) {
        case GL_SAMPLER_2D:
        case GL_SAMPLER_CUBE:
          var TEX = scope.def(VALUE, '._texture');
          scope(GL, '.uniform1i(', LOCATION, ',', TEX, '.bind());');
          scope.exit(TEX, '.unbind();');
          continue

        case GL_INT$3:
        case GL_BOOL:
          infix = '1i';
          break

        case GL_INT_VEC2:
        case GL_BOOL_VEC2:
          infix = '2i';
          unroll = 2;
          break

        case GL_INT_VEC3:
        case GL_BOOL_VEC3:
          infix = '3i';
          unroll = 3;
          break

        case GL_INT_VEC4:
        case GL_BOOL_VEC4:
          infix = '4i';
          unroll = 4;
          break

        case GL_FLOAT$7:
          infix = '1f';
          break

        case GL_FLOAT_VEC2:
          infix = '2f';
          unroll = 2;
          break

        case GL_FLOAT_VEC3:
          infix = '3f';
          unroll = 3;
          break

        case GL_FLOAT_VEC4:
          infix = '4f';
          unroll = 4;
          break

        case GL_FLOAT_MAT2:
          infix = 'Matrix2fv';
          break

        case GL_FLOAT_MAT3:
          infix = 'Matrix3fv';
          break

        case GL_FLOAT_MAT4:
          infix = 'Matrix4fv';
          break
      }

      scope(GL, '.uniform', infix, '(', LOCATION, ',');
      if (infix.charAt(0) === 'M') {
        var matSize = Math.pow(type - GL_FLOAT_MAT2 + 2, 2);
        var STORAGE = env.global.def('new Float32Array(', matSize, ')');
        scope(
          'false,(Array.isArray(', VALUE, ')||', VALUE, ' instanceof Float32Array)?', VALUE, ':(',
          loop(matSize, function (i) {
            return STORAGE + '[' + i + ']=' + VALUE + '[' + i + ']'
          }), ',', STORAGE, ')');
      } else if (unroll > 1) {
        scope(loop(unroll, function (i) {
          return VALUE + '[' + i + ']'
        }));
      } else {
        scope(VALUE);
      }
      scope(');');
    }
  }

  function emitDraw (env, outer, inner, args) {
    var shared = env.shared;
    var GL = shared.gl;
    var DRAW_STATE = shared.draw;

    var drawOptions = args.draw;

    function emitElements () {
      var defn = drawOptions.elements;
      var ELEMENTS;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        ELEMENTS = defn.append(env, scope);
      } else {
        ELEMENTS = scope.def(DRAW_STATE, '.', S_ELEMENTS);
      }
      if (ELEMENTS) {
        scope(
          'if(' + ELEMENTS + ')' +
          GL + '.bindBuffer(' + GL_ELEMENT_ARRAY_BUFFER$1 + ',' + ELEMENTS + '.buffer.buffer);');
      }
      return ELEMENTS
    }

    function emitCount () {
      var defn = drawOptions.count;
      var COUNT;
      var scope = outer;
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          scope = inner;
        }
        COUNT = defn.append(env, scope);
        check$1.optional(function () {
          if (defn.MISSING) {
            env.assert(outer, 'false', 'missing vertex count');
          }
          if (defn.DYNAMIC) {
            env.assert(scope, COUNT + '>=0', 'missing vertex count');
          }
        });
      } else {
        COUNT = scope.def(DRAW_STATE, '.', S_COUNT);
        check$1.optional(function () {
          env.assert(scope, COUNT + '>=0', 'missing vertex count');
        });
      }
      return COUNT
    }

    var ELEMENTS = emitElements();
    function emitValue (name) {
      var defn = drawOptions[name];
      if (defn) {
        if ((defn.contextDep && args.contextDynamic) || defn.propDep) {
          return defn.append(env, inner)
        } else {
          return defn.append(env, outer)
        }
      } else {
        return outer.def(DRAW_STATE, '.', name)
      }
    }

    var PRIMITIVE = emitValue(S_PRIMITIVE);
    var OFFSET = emitValue(S_OFFSET);

    var COUNT = emitCount();
    if (typeof COUNT === 'number') {
      if (COUNT === 0) {
        return
      }
    } else {
      inner('if(', COUNT, '){');
      inner.exit('}');
    }

    var INSTANCES, EXT_INSTANCING;
    if (extInstancing) {
      INSTANCES = emitValue(S_INSTANCES);
      EXT_INSTANCING = env.instancing;
    }

    var ELEMENT_TYPE = ELEMENTS + '.type';

    var elementsStatic = drawOptions.elements && isStatic(drawOptions.elements);

    function emitInstancing () {
      function drawElements () {
        inner(EXT_INSTANCING, '.drawElementsInstancedANGLE(', [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$7 + ')>>1)',
          INSTANCES
        ], ');');
      }

      function drawArrays () {
        inner(EXT_INSTANCING, '.drawArraysInstancedANGLE(',
          [PRIMITIVE, OFFSET, COUNT, INSTANCES], ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    function emitRegular () {
      function drawElements () {
        inner(GL + '.drawElements(' + [
          PRIMITIVE,
          COUNT,
          ELEMENT_TYPE,
          OFFSET + '<<((' + ELEMENT_TYPE + '-' + GL_UNSIGNED_BYTE$7 + ')>>1)'
        ] + ');');
      }

      function drawArrays () {
        inner(GL + '.drawArrays(' + [PRIMITIVE, OFFSET, COUNT] + ');');
      }

      if (ELEMENTS) {
        if (!elementsStatic) {
          inner('if(', ELEMENTS, '){');
          drawElements();
          inner('}else{');
          drawArrays();
          inner('}');
        } else {
          drawElements();
        }
      } else {
        drawArrays();
      }
    }

    if (extInstancing && (typeof INSTANCES !== 'number' || INSTANCES >= 0)) {
      if (typeof INSTANCES === 'string') {
        inner('if(', INSTANCES, '>0){');
        emitInstancing();
        inner('}else if(', INSTANCES, '<0){');
        emitRegular();
        inner('}');
      } else {
        emitInstancing();
      }
    } else {
      emitRegular();
    }
  }

  function createBody (emitBody, parentEnv, args, program, count) {
    var env = createREGLEnvironment();
    var scope = env.proc('body', count);
    check$1.optional(function () {
      env.commandStr = parentEnv.commandStr;
      env.command = env.link(parentEnv.commandStr);
    });
    if (extInstancing) {
      env.instancing = scope.def(
        env.shared.extensions, '.angle_instanced_arrays');
    }
    emitBody(env, scope, args, program);
    return env.compile().body
  }

  // ===================================================
  // ===================================================
  // DRAW PROC
  // ===================================================
  // ===================================================
  function emitDrawBody (env, draw, args, program) {
    injectExtensions(env, draw);
    emitAttributes(env, draw, args, program.attributes, function () {
      return true
    });
    emitUniforms(env, draw, args, program.uniforms, function () {
      return true
    });
    emitDraw(env, draw, draw, args);
  }

  function emitDrawProc (env, args) {
    var draw = env.proc('draw', 1);

    injectExtensions(env, draw);

    emitContext(env, draw, args.context);
    emitPollFramebuffer(env, draw, args.framebuffer);

    emitPollState(env, draw, args);
    emitSetOptions(env, draw, args.state);

    emitProfile(env, draw, args, false, true);

    var program = args.shader.progVar.append(env, draw);
    draw(env.shared.gl, '.useProgram(', program, '.program);');

    if (args.shader.program) {
      emitDrawBody(env, draw, args, args.shader.program);
    } else {
      var drawCache = env.global.def('{}');
      var PROG_ID = draw.def(program, '.id');
      var CACHED_PROC = draw.def(drawCache, '[', PROG_ID, ']');
      draw(
        env.cond(CACHED_PROC)
          .then(CACHED_PROC, '.call(this,a0);')
          .else(
            CACHED_PROC, '=', drawCache, '[', PROG_ID, ']=',
            env.link(function (program) {
              return createBody(emitDrawBody, env, args, program, 1)
            }), '(', program, ');',
            CACHED_PROC, '.call(this,a0);'));
    }

    if (Object.keys(args.state).length > 0) {
      draw(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // BATCH PROC
  // ===================================================
  // ===================================================

  function emitBatchDynamicShaderBody (env, scope, args, program) {
    env.batchId = 'a1';

    injectExtensions(env, scope);

    function all () {
      return true
    }

    emitAttributes(env, scope, args, program.attributes, all);
    emitUniforms(env, scope, args, program.uniforms, all);
    emitDraw(env, scope, scope, args);
  }

  function emitBatchBody (env, scope, args, program) {
    injectExtensions(env, scope);

    var contextDynamic = args.contextDep;

    var BATCH_ID = scope.def();
    var PROP_LIST = 'a0';
    var NUM_PROPS = 'a1';
    var PROPS = scope.def();
    env.shared.props = PROPS;
    env.batchId = BATCH_ID;

    var outer = env.scope();
    var inner = env.scope();

    scope(
      outer.entry,
      'for(', BATCH_ID, '=0;', BATCH_ID, '<', NUM_PROPS, ';++', BATCH_ID, '){',
      PROPS, '=', PROP_LIST, '[', BATCH_ID, '];',
      inner,
      '}',
      outer.exit);

    function isInnerDefn (defn) {
      return ((defn.contextDep && contextDynamic) || defn.propDep)
    }

    function isOuterDefn (defn) {
      return !isInnerDefn(defn)
    }

    if (args.needsContext) {
      emitContext(env, inner, args.context);
    }
    if (args.needsFramebuffer) {
      emitPollFramebuffer(env, inner, args.framebuffer);
    }
    emitSetOptions(env, inner, args.state, isInnerDefn);

    if (args.profile && isInnerDefn(args.profile)) {
      emitProfile(env, inner, args, false, true);
    }

    if (!program) {
      var progCache = env.global.def('{}');
      var PROGRAM = args.shader.progVar.append(env, inner);
      var PROG_ID = inner.def(PROGRAM, '.id');
      var CACHED_PROC = inner.def(progCache, '[', PROG_ID, ']');
      inner(
        env.shared.gl, '.useProgram(', PROGRAM, '.program);',
        'if(!', CACHED_PROC, '){',
        CACHED_PROC, '=', progCache, '[', PROG_ID, ']=',
        env.link(function (program) {
          return createBody(
            emitBatchDynamicShaderBody, env, args, program, 2)
        }), '(', PROGRAM, ');}',
        CACHED_PROC, '.call(this,a0[', BATCH_ID, '],', BATCH_ID, ');');
    } else {
      emitAttributes(env, outer, args, program.attributes, isOuterDefn);
      emitAttributes(env, inner, args, program.attributes, isInnerDefn);
      emitUniforms(env, outer, args, program.uniforms, isOuterDefn);
      emitUniforms(env, inner, args, program.uniforms, isInnerDefn);
      emitDraw(env, outer, inner, args);
    }
  }

  function emitBatchProc (env, args) {
    var batch = env.proc('batch', 2);
    env.batchId = '0';

    injectExtensions(env, batch);

    // Check if any context variables depend on props
    var contextDynamic = false;
    var needsContext = true;
    Object.keys(args.context).forEach(function (name) {
      contextDynamic = contextDynamic || args.context[name].propDep;
    });
    if (!contextDynamic) {
      emitContext(env, batch, args.context);
      needsContext = false;
    }

    // framebuffer state affects framebufferWidth/height context vars
    var framebuffer = args.framebuffer;
    var needsFramebuffer = false;
    if (framebuffer) {
      if (framebuffer.propDep) {
        contextDynamic = needsFramebuffer = true;
      } else if (framebuffer.contextDep && contextDynamic) {
        needsFramebuffer = true;
      }
      if (!needsFramebuffer) {
        emitPollFramebuffer(env, batch, framebuffer);
      }
    } else {
      emitPollFramebuffer(env, batch, null);
    }

    // viewport is weird because it can affect context vars
    if (args.state.viewport && args.state.viewport.propDep) {
      contextDynamic = true;
    }

    function isInnerDefn (defn) {
      return (defn.contextDep && contextDynamic) || defn.propDep
    }

    // set webgl options
    emitPollState(env, batch, args);
    emitSetOptions(env, batch, args.state, function (defn) {
      return !isInnerDefn(defn)
    });

    if (!args.profile || !isInnerDefn(args.profile)) {
      emitProfile(env, batch, args, false, 'a1');
    }

    // Save these values to args so that the batch body routine can use them
    args.contextDep = contextDynamic;
    args.needsContext = needsContext;
    args.needsFramebuffer = needsFramebuffer;

    // determine if shader is dynamic
    var progDefn = args.shader.progVar;
    if ((progDefn.contextDep && contextDynamic) || progDefn.propDep) {
      emitBatchBody(
        env,
        batch,
        args,
        null);
    } else {
      var PROGRAM = progDefn.append(env, batch);
      batch(env.shared.gl, '.useProgram(', PROGRAM, '.program);');
      if (args.shader.program) {
        emitBatchBody(
          env,
          batch,
          args,
          args.shader.program);
      } else {
        var batchCache = env.global.def('{}');
        var PROG_ID = batch.def(PROGRAM, '.id');
        var CACHED_PROC = batch.def(batchCache, '[', PROG_ID, ']');
        batch(
          env.cond(CACHED_PROC)
            .then(CACHED_PROC, '.call(this,a0,a1);')
            .else(
              CACHED_PROC, '=', batchCache, '[', PROG_ID, ']=',
              env.link(function (program) {
                return createBody(emitBatchBody, env, args, program, 2)
              }), '(', PROGRAM, ');',
              CACHED_PROC, '.call(this,a0,a1);'));
      }
    }

    if (Object.keys(args.state).length > 0) {
      batch(env.shared.current, '.dirty=true;');
    }
  }

  // ===================================================
  // ===================================================
  // SCOPE COMMAND
  // ===================================================
  // ===================================================
  function emitScopeProc (env, args) {
    var scope = env.proc('scope', 3);
    env.batchId = 'a2';

    var shared = env.shared;
    var CURRENT_STATE = shared.current;

    emitContext(env, scope, args.context);

    if (args.framebuffer) {
      args.framebuffer.append(env, scope);
    }

    sortState(Object.keys(args.state)).forEach(function (name) {
      var defn = args.state[name];
      var value = defn.append(env, scope);
      if (isArrayLike(value)) {
        value.forEach(function (v, i) {
          scope.set(env.next[name], '[' + i + ']', v);
        });
      } else {
        scope.set(shared.next, '.' + name, value);
      }
    });

    emitProfile(env, scope, args, true, true)

    ;[S_ELEMENTS, S_OFFSET, S_COUNT, S_INSTANCES, S_PRIMITIVE].forEach(
      function (opt) {
        var variable = args.draw[opt];
        if (!variable) {
          return
        }
        scope.set(shared.draw, '.' + opt, '' + variable.append(env, scope));
      });

    Object.keys(args.uniforms).forEach(function (opt) {
      scope.set(
        shared.uniforms,
        '[' + stringStore.id(opt) + ']',
        args.uniforms[opt].append(env, scope));
    });

    Object.keys(args.attributes).forEach(function (name) {
      var record = args.attributes[name].append(env, scope);
      var scopeAttrib = env.scopeAttrib(name);
      Object.keys(new AttributeRecord()).forEach(function (prop) {
        scope.set(scopeAttrib, '.' + prop, record[prop]);
      });
    });

    function saveShader (name) {
      var shader = args.shader[name];
      if (shader) {
        scope.set(shared.shader, '.' + name, shader.append(env, scope));
      }
    }
    saveShader(S_VERT);
    saveShader(S_FRAG);

    if (Object.keys(args.state).length > 0) {
      scope(CURRENT_STATE, '.dirty=true;');
      scope.exit(CURRENT_STATE, '.dirty=true;');
    }

    scope('a1(', env.shared.context, ',a0,', env.batchId, ');');
  }

  function isDynamicObject (object) {
    if (typeof object !== 'object' || isArrayLike(object)) {
      return
    }
    var props = Object.keys(object);
    for (var i = 0; i < props.length; ++i) {
      if (dynamic.isDynamic(object[props[i]])) {
        return true
      }
    }
    return false
  }

  function splatObject (env, options, name) {
    var object = options.static[name];
    if (!object || !isDynamicObject(object)) {
      return
    }

    var globals = env.global;
    var keys = Object.keys(object);
    var thisDep = false;
    var contextDep = false;
    var propDep = false;
    var objectRef = env.global.def('{}');
    keys.forEach(function (key) {
      var value = object[key];
      if (dynamic.isDynamic(value)) {
        if (typeof value === 'function') {
          value = object[key] = dynamic.unbox(value);
        }
        var deps = createDynamicDecl(value, null);
        thisDep = thisDep || deps.thisDep;
        propDep = propDep || deps.propDep;
        contextDep = contextDep || deps.contextDep;
      } else {
        globals(objectRef, '.', key, '=');
        switch (typeof value) {
          case 'number':
            globals(value);
            break
          case 'string':
            globals('"', value, '"');
            break
          case 'object':
            if (Array.isArray(value)) {
              globals('[', value.join(), ']');
            }
            break
          default:
            globals(env.link(value));
            break
        }
        globals(';');
      }
    });

    function appendBlock (env, block) {
      keys.forEach(function (key) {
        var value = object[key];
        if (!dynamic.isDynamic(value)) {
          return
        }
        var ref = env.invoke(block, value);
        block(objectRef, '.', key, '=', ref, ';');
      });
    }

    options.dynamic[name] = new dynamic.DynamicVariable(DYN_THUNK, {
      thisDep: thisDep,
      contextDep: contextDep,
      propDep: propDep,
      ref: objectRef,
      append: appendBlock
    });
    delete options.static[name];
  }

  // ===========================================================================
  // ===========================================================================
  // MAIN DRAW COMMAND
  // ===========================================================================
  // ===========================================================================
  function compileCommand (options, attributes, uniforms, context, stats) {
    var env = createREGLEnvironment();

    // link stats, so that we can easily access it in the program.
    env.stats = env.link(stats);

    // splat options and attributes to allow for dynamic nested properties
    Object.keys(attributes.static).forEach(function (key) {
      splatObject(env, attributes, key);
    });
    NESTED_OPTIONS.forEach(function (name) {
      splatObject(env, options, name);
    });

    var args = parseArguments(options, attributes, uniforms, context, env);

    emitDrawProc(env, args);
    emitScopeProc(env, args);
    emitBatchProc(env, args);

    return env.compile()
  }

  // ===========================================================================
  // ===========================================================================
  // POLL / REFRESH
  // ===========================================================================
  // ===========================================================================
  return {
    next: nextState,
    current: currentState,
    procs: (function () {
      var env = createREGLEnvironment();
      var poll = env.proc('poll');
      var refresh = env.proc('refresh');
      var common = env.block();
      poll(common);
      refresh(common);

      var shared = env.shared;
      var GL = shared.gl;
      var NEXT_STATE = shared.next;
      var CURRENT_STATE = shared.current;

      common(CURRENT_STATE, '.dirty=false;');

      emitPollFramebuffer(env, poll);
      emitPollFramebuffer(env, refresh, null, true);

      // Refresh updates all attribute state changes
      var extInstancing = gl.getExtension('angle_instanced_arrays');
      var INSTANCING;
      if (extInstancing) {
        INSTANCING = env.link(extInstancing);
      }
      for (var i = 0; i < limits.maxAttributes; ++i) {
        var BINDING = refresh.def(shared.attributes, '[', i, ']');
        var ifte = env.cond(BINDING, '.buffer');
        ifte.then(
          GL, '.enableVertexAttribArray(', i, ');',
          GL, '.bindBuffer(',
            GL_ARRAY_BUFFER$1, ',',
            BINDING, '.buffer.buffer);',
          GL, '.vertexAttribPointer(',
            i, ',',
            BINDING, '.size,',
            BINDING, '.type,',
            BINDING, '.normalized,',
            BINDING, '.stride,',
            BINDING, '.offset);'
        ).else(
          GL, '.disableVertexAttribArray(', i, ');',
          GL, '.vertexAttrib4f(',
            i, ',',
            BINDING, '.x,',
            BINDING, '.y,',
            BINDING, '.z,',
            BINDING, '.w);',
          BINDING, '.buffer=null;');
        refresh(ifte);
        if (extInstancing) {
          refresh(
            INSTANCING, '.vertexAttribDivisorANGLE(',
            i, ',',
            BINDING, '.divisor);');
        }
      }

      Object.keys(GL_FLAGS).forEach(function (flag) {
        var cap = GL_FLAGS[flag];
        var NEXT = common.def(NEXT_STATE, '.', flag);
        var block = env.block();
        block('if(', NEXT, '){',
          GL, '.enable(', cap, ')}else{',
          GL, '.disable(', cap, ')}',
          CURRENT_STATE, '.', flag, '=', NEXT, ';');
        refresh(block);
        poll(
          'if(', NEXT, '!==', CURRENT_STATE, '.', flag, '){',
          block,
          '}');
      });

      Object.keys(GL_VARIABLES).forEach(function (name) {
        var func = GL_VARIABLES[name];
        var init = currentState[name];
        var NEXT, CURRENT;
        var block = env.block();
        block(GL, '.', func, '(');
        if (isArrayLike(init)) {
          var n = init.length;
          NEXT = env.global.def(NEXT_STATE, '.', name);
          CURRENT = env.global.def(CURRENT_STATE, '.', name);
          block(
            loop(n, function (i) {
              return NEXT + '[' + i + ']'
            }), ');',
            loop(n, function (i) {
              return CURRENT + '[' + i + ']=' + NEXT + '[' + i + '];'
            }).join(''));
          poll(
            'if(', loop(n, function (i) {
              return NEXT + '[' + i + ']!==' + CURRENT + '[' + i + ']'
            }).join('||'), '){',
            block,
            '}');
        } else {
          NEXT = common.def(NEXT_STATE, '.', name);
          CURRENT = common.def(CURRENT_STATE, '.', name);
          block(
            NEXT, ');',
            CURRENT_STATE, '.', name, '=', NEXT, ';');
          poll(
            'if(', NEXT, '!==', CURRENT, '){',
            block,
            '}');
        }
        refresh(block);
      });

      return env.compile()
    })(),
    compile: compileCommand
  }
}

function stats () {
  return {
    bufferCount: 0,
    elementsCount: 0,
    framebufferCount: 0,
    shaderCount: 0,
    textureCount: 0,
    cubeCount: 0,
    renderbufferCount: 0,

    maxTextureUnits: 0
  }
}

var GL_QUERY_RESULT_EXT = 0x8866;
var GL_QUERY_RESULT_AVAILABLE_EXT = 0x8867;
var GL_TIME_ELAPSED_EXT = 0x88BF;

var createTimer = function (gl, extensions) {
  var extTimer = extensions.ext_disjoint_timer_query;

  if (!extTimer) {
    return null
  }

  // QUERY POOL BEGIN
  var queryPool = [];
  function allocQuery () {
    return queryPool.pop() || extTimer.createQueryEXT()
  }
  function freeQuery (query) {
    queryPool.push(query);
  }
  // QUERY POOL END

  var pendingQueries = [];
  function beginQuery (stats) {
    var query = allocQuery();
    extTimer.beginQueryEXT(GL_TIME_ELAPSED_EXT, query);
    pendingQueries.push(query);
    pushScopeStats(pendingQueries.length - 1, pendingQueries.length, stats);
  }

  function endQuery () {
    extTimer.endQueryEXT(GL_TIME_ELAPSED_EXT);
  }

  //
  // Pending stats pool.
  //
  function PendingStats () {
    this.startQueryIndex = -1;
    this.endQueryIndex = -1;
    this.sum = 0;
    this.stats = null;
  }
  var pendingStatsPool = [];
  function allocPendingStats () {
    return pendingStatsPool.pop() || new PendingStats()
  }
  function freePendingStats (pendingStats) {
    pendingStatsPool.push(pendingStats);
  }
  // Pending stats pool end

  var pendingStats = [];
  function pushScopeStats (start, end, stats) {
    var ps = allocPendingStats();
    ps.startQueryIndex = start;
    ps.endQueryIndex = end;
    ps.sum = 0;
    ps.stats = stats;
    pendingStats.push(ps);
  }

  // we should call this at the beginning of the frame,
  // in order to update gpuTime
  var timeSum = [];
  var queryPtr = [];
  function update () {
    var ptr, i;

    var n = pendingQueries.length;
    if (n === 0) {
      return
    }

    // Reserve space
    queryPtr.length = Math.max(queryPtr.length, n + 1);
    timeSum.length = Math.max(timeSum.length, n + 1);
    timeSum[0] = 0;
    queryPtr[0] = 0;

    // Update all pending timer queries
    var queryTime = 0;
    ptr = 0;
    for (i = 0; i < pendingQueries.length; ++i) {
      var query = pendingQueries[i];
      if (extTimer.getQueryObjectEXT(query, GL_QUERY_RESULT_AVAILABLE_EXT)) {
        queryTime += extTimer.getQueryObjectEXT(query, GL_QUERY_RESULT_EXT);
        freeQuery(query);
      } else {
        pendingQueries[ptr++] = query;
      }
      timeSum[i + 1] = queryTime;
      queryPtr[i + 1] = ptr;
    }
    pendingQueries.length = ptr;

    // Update all pending stat queries
    ptr = 0;
    for (i = 0; i < pendingStats.length; ++i) {
      var stats = pendingStats[i];
      var start = stats.startQueryIndex;
      var end = stats.endQueryIndex;
      stats.sum += timeSum[end] - timeSum[start];
      var startPtr = queryPtr[start];
      var endPtr = queryPtr[end];
      if (endPtr === startPtr) {
        stats.stats.gpuTime += stats.sum / 1e6;
        freePendingStats(stats);
      } else {
        stats.startQueryIndex = startPtr;
        stats.endQueryIndex = endPtr;
        pendingStats[ptr++] = stats;
      }
    }
    pendingStats.length = ptr;
  }

  return {
    beginQuery: beginQuery,
    endQuery: endQuery,
    pushScopeStats: pushScopeStats,
    update: update,
    getNumPendingQueries: function () {
      return pendingQueries.length
    },
    clear: function () {
      queryPool.push.apply(queryPool, pendingQueries);
      for (var i = 0; i < queryPool.length; i++) {
        extTimer.deleteQueryEXT(queryPool[i]);
      }
      pendingQueries.length = 0;
      queryPool.length = 0;
    },
    restore: function () {
      pendingQueries.length = 0;
      queryPool.length = 0;
    }
  }
};

var GL_COLOR_BUFFER_BIT = 16384;
var GL_DEPTH_BUFFER_BIT = 256;
var GL_STENCIL_BUFFER_BIT = 1024;

var GL_ARRAY_BUFFER = 34962;

var CONTEXT_LOST_EVENT = 'webglcontextlost';
var CONTEXT_RESTORED_EVENT = 'webglcontextrestored';

var DYN_PROP = 1;
var DYN_CONTEXT = 2;
var DYN_STATE = 3;

function find (haystack, needle) {
  for (var i = 0; i < haystack.length; ++i) {
    if (haystack[i] === needle) {
      return i
    }
  }
  return -1
}

function wrapREGL (args) {
  var config = parseArgs(args);
  if (!config) {
    return null
  }

  var gl = config.gl;
  var glAttributes = gl.getContextAttributes();
  var contextLost = gl.isContextLost();

  var extensionState = createExtensionCache(gl, config);
  if (!extensionState) {
    return null
  }

  var stringStore = createStringStore();
  var stats$$1 = stats();
  var extensions = extensionState.extensions;
  var timer = createTimer(gl, extensions);

  var START_TIME = clock();
  var WIDTH = gl.drawingBufferWidth;
  var HEIGHT = gl.drawingBufferHeight;

  var contextState = {
    tick: 0,
    time: 0,
    viewportWidth: WIDTH,
    viewportHeight: HEIGHT,
    framebufferWidth: WIDTH,
    framebufferHeight: HEIGHT,
    drawingBufferWidth: WIDTH,
    drawingBufferHeight: HEIGHT,
    pixelRatio: config.pixelRatio
  };
  var uniformState = {};
  var drawState = {
    elements: null,
    primitive: 4, // GL_TRIANGLES
    count: -1,
    offset: 0,
    instances: -1
  };

  var limits = wrapLimits(gl, extensions);
  var bufferState = wrapBufferState(gl, stats$$1, config);
  var elementState = wrapElementsState(gl, extensions, bufferState, stats$$1);
  var attributeState = wrapAttributeState(
    gl,
    extensions,
    limits,
    bufferState,
    stringStore);
  var shaderState = wrapShaderState(gl, stringStore, stats$$1, config);
  var textureState = createTextureSet(
    gl,
    extensions,
    limits,
    function () { core.procs.poll(); },
    contextState,
    stats$$1,
    config);
  var renderbufferState = wrapRenderbuffers(gl, extensions, limits, stats$$1, config);
  var framebufferState = wrapFBOState(
    gl,
    extensions,
    limits,
    textureState,
    renderbufferState,
    stats$$1);
  var core = reglCore(
    gl,
    stringStore,
    extensions,
    limits,
    bufferState,
    elementState,
    textureState,
    framebufferState,
    uniformState,
    attributeState,
    shaderState,
    drawState,
    contextState,
    timer,
    config);
  var readPixels = wrapReadPixels(
    gl,
    framebufferState,
    core.procs.poll,
    contextState,
    glAttributes, extensions);

  var nextState = core.next;
  var canvas = gl.canvas;

  var rafCallbacks = [];
  var lossCallbacks = [];
  var restoreCallbacks = [];
  var destroyCallbacks = [config.onDestroy];

  var activeRAF = null;
  function handleRAF () {
    if (rafCallbacks.length === 0) {
      if (timer) {
        timer.update();
      }
      activeRAF = null;
      return
    }

    // schedule next animation frame
    activeRAF = raf.next(handleRAF);

    // poll for changes
    poll();

    // fire a callback for all pending rafs
    for (var i = rafCallbacks.length - 1; i >= 0; --i) {
      var cb = rafCallbacks[i];
      if (cb) {
        cb(contextState, null, 0);
      }
    }

    // flush all pending webgl calls
    gl.flush();

    // poll GPU timers *after* gl.flush so we don't delay command dispatch
    if (timer) {
      timer.update();
    }
  }

  function startRAF () {
    if (!activeRAF && rafCallbacks.length > 0) {
      activeRAF = raf.next(handleRAF);
    }
  }

  function stopRAF () {
    if (activeRAF) {
      raf.cancel(handleRAF);
      activeRAF = null;
    }
  }

  function handleContextLoss (event) {
    event.preventDefault();

    // set context lost flag
    contextLost = true;

    // pause request animation frame
    stopRAF();

    // lose context
    lossCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function handleContextRestored (event) {
    // clear error code
    gl.getError();

    // clear context lost flag
    contextLost = false;

    // refresh state
    extensionState.restore();
    shaderState.restore();
    bufferState.restore();
    textureState.restore();
    renderbufferState.restore();
    framebufferState.restore();
    if (timer) {
      timer.restore();
    }

    // refresh state
    core.procs.refresh();

    // restart RAF
    startRAF();

    // restore context
    restoreCallbacks.forEach(function (cb) {
      cb();
    });
  }

  if (canvas) {
    canvas.addEventListener(CONTEXT_LOST_EVENT, handleContextLoss, false);
    canvas.addEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored, false);
  }

  function destroy () {
    rafCallbacks.length = 0;
    stopRAF();

    if (canvas) {
      canvas.removeEventListener(CONTEXT_LOST_EVENT, handleContextLoss);
      canvas.removeEventListener(CONTEXT_RESTORED_EVENT, handleContextRestored);
    }

    shaderState.clear();
    framebufferState.clear();
    renderbufferState.clear();
    textureState.clear();
    elementState.clear();
    bufferState.clear();

    if (timer) {
      timer.clear();
    }

    destroyCallbacks.forEach(function (cb) {
      cb();
    });
  }

  function compileProcedure (options) {
    check$1(!!options, 'invalid args to regl({...})');
    check$1.type(options, 'object', 'invalid args to regl({...})');

    function flattenNestedOptions (options) {
      var result = extend({}, options);
      delete result.uniforms;
      delete result.attributes;
      delete result.context;

      if ('stencil' in result && result.stencil.op) {
        result.stencil.opBack = result.stencil.opFront = result.stencil.op;
        delete result.stencil.op;
      }

      function merge (name) {
        if (name in result) {
          var child = result[name];
          delete result[name];
          Object.keys(child).forEach(function (prop) {
            result[name + '.' + prop] = child[prop];
          });
        }
      }
      merge('blend');
      merge('depth');
      merge('cull');
      merge('stencil');
      merge('polygonOffset');
      merge('scissor');
      merge('sample');

      return result
    }

    function separateDynamic (object) {
      var staticItems = {};
      var dynamicItems = {};
      Object.keys(object).forEach(function (option) {
        var value = object[option];
        if (dynamic.isDynamic(value)) {
          dynamicItems[option] = dynamic.unbox(value, option);
        } else {
          staticItems[option] = value;
        }
      });
      return {
        dynamic: dynamicItems,
        static: staticItems
      }
    }

    // Treat context variables separate from other dynamic variables
    var context = separateDynamic(options.context || {});
    var uniforms = separateDynamic(options.uniforms || {});
    var attributes = separateDynamic(options.attributes || {});
    var opts = separateDynamic(flattenNestedOptions(options));

    var stats$$1 = {
      gpuTime: 0.0,
      cpuTime: 0.0,
      count: 0
    };

    var compiled = core.compile(opts, attributes, uniforms, context, stats$$1);

    var draw = compiled.draw;
    var batch = compiled.batch;
    var scope = compiled.scope;

    // FIXME: we should modify code generation for batch commands so this
    // isn't necessary
    var EMPTY_ARRAY = [];
    function reserve (count) {
      while (EMPTY_ARRAY.length < count) {
        EMPTY_ARRAY.push(null);
      }
      return EMPTY_ARRAY
    }

    function REGLCommand (args, body) {
      var i;
      if (contextLost) {
        check$1.raise('context lost');
      }
      if (typeof args === 'function') {
        return scope.call(this, null, args, 0)
      } else if (typeof body === 'function') {
        if (typeof args === 'number') {
          for (i = 0; i < args; ++i) {
            scope.call(this, null, body, i);
          }
          return
        } else if (Array.isArray(args)) {
          for (i = 0; i < args.length; ++i) {
            scope.call(this, args[i], body, i);
          }
          return
        } else {
          return scope.call(this, args, body, 0)
        }
      } else if (typeof args === 'number') {
        if (args > 0) {
          return batch.call(this, reserve(args | 0), args | 0)
        }
      } else if (Array.isArray(args)) {
        if (args.length) {
          return batch.call(this, args, args.length)
        }
      } else {
        return draw.call(this, args)
      }
    }

    return extend(REGLCommand, {
      stats: stats$$1
    })
  }

  var setFBO = framebufferState.setFBO = compileProcedure({
    framebuffer: dynamic.define.call(null, DYN_PROP, 'framebuffer')
  });

  function clearImpl (_, options) {
    var clearFlags = 0;
    core.procs.poll();

    var c = options.color;
    if (c) {
      gl.clearColor(+c[0] || 0, +c[1] || 0, +c[2] || 0, +c[3] || 0);
      clearFlags |= GL_COLOR_BUFFER_BIT;
    }
    if ('depth' in options) {
      gl.clearDepth(+options.depth);
      clearFlags |= GL_DEPTH_BUFFER_BIT;
    }
    if ('stencil' in options) {
      gl.clearStencil(options.stencil | 0);
      clearFlags |= GL_STENCIL_BUFFER_BIT;
    }

    check$1(!!clearFlags, 'called regl.clear with no buffer specified');
    gl.clear(clearFlags);
  }

  function clear (options) {
    check$1(
      typeof options === 'object' && options,
      'regl.clear() takes an object as input');
    if ('framebuffer' in options) {
      if (options.framebuffer &&
          options.framebuffer_reglType === 'framebufferCube') {
        for (var i = 0; i < 6; ++i) {
          setFBO(extend({
            framebuffer: options.framebuffer.faces[i]
          }, options), clearImpl);
        }
      } else {
        setFBO(options, clearImpl);
      }
    } else {
      clearImpl(null, options);
    }
  }

  function frame (cb) {
    check$1.type(cb, 'function', 'regl.frame() callback must be a function');
    rafCallbacks.push(cb);

    function cancel () {
      // FIXME:  should we check something other than equals cb here?
      // what if a user calls frame twice with the same callback...
      //
      var i = find(rafCallbacks, cb);
      check$1(i >= 0, 'cannot cancel a frame twice');
      function pendingCancel () {
        var index = find(rafCallbacks, pendingCancel);
        rafCallbacks[index] = rafCallbacks[rafCallbacks.length - 1];
        rafCallbacks.length -= 1;
        if (rafCallbacks.length <= 0) {
          stopRAF();
        }
      }
      rafCallbacks[i] = pendingCancel;
    }

    startRAF();

    return {
      cancel: cancel
    }
  }

  // poll viewport
  function pollViewport () {
    var viewport = nextState.viewport;
    var scissorBox = nextState.scissor_box;
    viewport[0] = viewport[1] = scissorBox[0] = scissorBox[1] = 0;
    contextState.viewportWidth =
      contextState.framebufferWidth =
      contextState.drawingBufferWidth =
      viewport[2] =
      scissorBox[2] = gl.drawingBufferWidth;
    contextState.viewportHeight =
      contextState.framebufferHeight =
      contextState.drawingBufferHeight =
      viewport[3] =
      scissorBox[3] = gl.drawingBufferHeight;
  }

  function poll () {
    contextState.tick += 1;
    contextState.time = now();
    pollViewport();
    core.procs.poll();
  }

  function refresh () {
    pollViewport();
    core.procs.refresh();
    if (timer) {
      timer.update();
    }
  }

  function now () {
    return (clock() - START_TIME) / 1000.0
  }

  refresh();

  function addListener (event, callback) {
    check$1.type(callback, 'function', 'listener callback must be a function');

    var callbacks;
    switch (event) {
      case 'frame':
        return frame(callback)
      case 'lost':
        callbacks = lossCallbacks;
        break
      case 'restore':
        callbacks = restoreCallbacks;
        break
      case 'destroy':
        callbacks = destroyCallbacks;
        break
      default:
        check$1.raise('invalid event, must be one of frame,lost,restore,destroy');
    }

    callbacks.push(callback);
    return {
      cancel: function () {
        for (var i = 0; i < callbacks.length; ++i) {
          if (callbacks[i] === callback) {
            callbacks[i] = callbacks[callbacks.length - 1];
            callbacks.pop();
            return
          }
        }
      }
    }
  }

  var regl = extend(compileProcedure, {
    // Clear current FBO
    clear: clear,

    // Short cuts for dynamic variables
    prop: dynamic.define.bind(null, DYN_PROP),
    context: dynamic.define.bind(null, DYN_CONTEXT),
    this: dynamic.define.bind(null, DYN_STATE),

    // executes an empty draw command
    draw: compileProcedure({}),

    // Resources
    buffer: function (options) {
      return bufferState.create(options, GL_ARRAY_BUFFER, false, false)
    },
    elements: function (options) {
      return elementState.create(options, false)
    },
    texture: textureState.create2D,
    cube: textureState.createCube,
    renderbuffer: renderbufferState.create,
    framebuffer: framebufferState.create,
    framebufferCube: framebufferState.createCube,

    // Expose context attributes
    attributes: glAttributes,

    // Frame rendering
    frame: frame,
    on: addListener,

    // System limits
    limits: limits,
    hasExtension: function (name) {
      return limits.extensions.indexOf(name.toLowerCase()) >= 0
    },

    // Read pixels
    read: readPixels,

    // Destroy regl and all associated resources
    destroy: destroy,

    // Direct GL state manipulation
    _gl: gl,
    _refresh: refresh,

    poll: function () {
      poll();
      if (timer) {
        timer.update();
      }
    },

    // Current time
    now: now,

    // regl Statistics Information
    stats: stats$$1
  });

  config.onDone(null, regl);

  return regl
}

return wrapREGL;

})));


},{}],72:[function(require,module,exports){
module.exports = function(allPrimitives, newPrimitive) {
  let cellOffset = 0;

  if(allPrimitives.positions) {
    cellOffset = allPrimitives.positions.length;
  }

  for (var attributeName in newPrimitive) {
    if (!allPrimitives[attributeName]) {
      allPrimitives[attributeName] = [];
    }

    if (attributeName !== 'cells') {
      allPrimitives[attributeName] = allPrimitives[attributeName].concat(newPrimitive[attributeName]);
    } else {
      const newCells = newPrimitive[attributeName].map((cell) => {
        return cell.slice().map(idx => idx + cellOffset);
      });

      allPrimitives[attributeName] = allPrimitives[attributeName].concat(newCells);
    }
  }
};

},{}]},{},[9]);

const getCube = require('primitive-cube');
const gl = require('glslify');
const mat4 = require('gl-mat4');

const cube = getCube(6, 10, 6);

module.exports = (regl) => {
  const frag = gl(`
    precision mediump float;

    #define PI 3.141592653589793

    #pragma glslify: blinnPhongSpec = require(glsl-specular-blinn-phong)
    #pragma glslify: getNoise = require(glsl-noise/simplex/2d) 

    uniform vec3 color;

    varying vec2 vUV;
    varying vec3 vNormal;
    varying vec3 vOriginalNormal;

    vec3 rotateX(vec3 vec, float rad) {
      mat3 rotation = mat3(
        1, 0, 0, 
        0, cos(rad), -sin(rad), 
        0, sin(rad), cos(rad)
      );

      return rotation * vec;
    }

    vec3 rotateY(vec3 vec, float rad) {
      mat3 rotation = mat3(
        cos(rad), 0, sin(rad), 
        0, 1, 0, 
        -sin(rad), 0, cos(rad)
      );

      return rotation * vec;
    }

    void main() {
      vec3 normal = vNormal;
      vec3 lightDirection1 = vec3(0, 0.5, 0.5);
      vec3 lightDirection2 = vec3(0, -1, 0);
      vec3 eyeDirection = vec3(0, 0, 1);
      float shininess = 3.0;

      bool isSide = vOriginalNormal.x > 0.0 || vOriginalNormal.x < 0.0 || vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0;

      if(isSide) {
        float lineSize = 0.03;
        float lineRotation = 0.0;

        // because the sides are layed out differently with uvs we need to do this
        if(vOriginalNormal.y > 0.0 || vOriginalNormal.y < 0.0) {  
          lineRotation += -(step(0.3, vUV.x) - step(0.3 + lineSize, vUV.x));
          lineRotation += step(0.3 - lineSize, vUV.x) - step(0.3, vUV.x);

          lineRotation += -(step(0.5, vUV.x) - step(0.5 + lineSize, vUV.x));
          lineRotation += step(0.5 - lineSize, vUV.x) - step(0.5, vUV.x);

          lineRotation += -(step(0.7, vUV.x) - step(0.7 + lineSize, vUV.x));
          lineRotation += step(0.7 - lineSize, vUV.x) - step(0.7, vUV.x);

          // bound it
          lineRotation *= step(0.05, vUV.y);
          lineRotation *= step(vUV.y, 0.95);
        } else {
          vec2 uvScaled = mod(vUV, 0.2) / 0.2;

          lineRotation += -(step(0.4, uvScaled.y) - step(0.4 + lineSize, uvScaled.y));
          lineRotation += step(0.4 - lineSize, uvScaled.y) - step(0.4, uvScaled.y);



          // bound it
          lineRotation *= step(0.3, vUV.x);
          lineRotation *= step(vUV.x, 0.7);
        }

        // this will give some noise to the surface
        lineRotation += getNoise(vUV * 100.0) * 0.05 - 0.025;

        // rotate it to get the line
        normal = rotateX(normal, lineRotation * PI * -0.5);
      }

      float power1 = blinnPhongSpec(lightDirection1, eyeDirection, normal, shininess);
      float power2 = blinnPhongSpec(lightDirection2, eyeDirection, normal, shininess);

      vec3 outColor = vec3(0.0);

      outColor += color  * power1;

      gl_FragColor = vec4(outColor, 1.0);
    }
  `);

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

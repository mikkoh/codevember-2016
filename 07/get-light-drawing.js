
const gl = require('glslify');
const mat4 = require('gl-mat4');

module.exports = (regl, attributes) => {
  const frag = gl(`
    precision mediump float;

    #pragma glslify: getNoise = require(glsl-noise/simplex/2d)

    void main() {
      vec3 outColor = vec3(gl_FragCoord.y / 1000.0, 1.0 - gl_FragCoord.y / 1000.0, 0.0);

      outColor *= getNoise(gl_FragCoord.xy / 1000.0 * 10.0) * 0.2 + 0.8;

      gl_FragColor = vec4(outColor, 0.5);
    }
  `);

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

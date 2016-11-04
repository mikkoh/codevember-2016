const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getBall = require('./get-ball');
const getBallGlass = require('./get-ball-glass');
const vec3 = require('gl-vec3');

const setupScene = getSetupScene(regl);
const drawBall = getBall(regl);
const drawInnerGlass = getBallGlass(regl, true);
const drawOuterGlass = getBallGlass(regl);

const countBalls = 200;

const gravity = -0.1;
const friction = 0.99;
const glassInnerRadius = 14;
const glassOuterRadius = glassInnerRadius + 1;
const damping = 0.99;

const state = Array.apply(null, Array(countBalls)).map((v, i) => {
  return {
    position: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    previousPosition: [0, gravity, 0],
    velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    radius: Math.random() * 0.4 + 0.2,
    color: i % 20 === 1 ? [1,0, 0] : [0, Math.random(), 0]
  };
});

state[0].color = [1, 0, 0.3];
state[0].radius = 4;

state[1].color = [0, 0, 0.3];
state[1].radius = 2;

state[2].color = [0, 0, 0.3];
state[2].radius = 2;

window.addEventListener('click', () => {
  state.forEach((ball) => {
    ball.previousPosition[1] += Math.random() * -4;
  });
});

function boundToSphere(ball, radius) {
  const halfRadius = ball.radius * 0.5;
  const radiusDiff = radius - ball.radius * 0.5;

  const distFromCenter = vec3.length(ball.position);

  if (distFromCenter + halfRadius > radius - halfRadius) {
    const diff = radiusDiff - (distFromCenter + halfRadius);

    vec3.scaleAndAdd(ball.position, ball.position, ball.position, diff / radiusDiff);
    // ball.velocity = ball.velocity.map(v => -v);
  }
}

function updateState(state) {
  state.forEach((ball, i) => {
    // update velocity
    // ball.velocity = ball.velocity.map((value, i) => {
    //   return value * friction;
    // });
    
    ball.velocity = ball.position.map((value, i) => {
     return (value - ball.previousPosition[i]) * damping;
    });

    ball.previousPosition = ball.position.slice();

    // add gravity
    ball.position[1] += gravity;

    // update position
    ball.position = ball.position.map((value, i) => {
      return value + ball.velocity[i];
    });
  });

  for(var i = 0; i < 1; i++) {
    // fix collisions and bound
    state.forEach((ball1) => {
      state.forEach((ball2) => {
        if (ball1 !== ball2) {
          let dist = vec3.distance(ball1.position, ball2.position);
          dist -= ball1.radius * 0.5;
          dist -= ball2.radius * 0.5;

          // they are colliding
          if (dist < 0) {
            const distComponent = ball1.position.map((b1, i) => {
              return b1 - ball2.position[i];
            });

            vec3.scaleAndAdd(ball1.position, ball1.position, distComponent, -dist / ball1.radius);
            vec3.scaleAndAdd(ball2.position, ball2.position, distComponent, dist / ball2.radius);
            // ball1.velocity = ball1.velocity.map(v => v * -0.99);
            // ball2.velocity = ball2.velocity.map(v => v * -0.99);
          }
        }
      });

      boundToSphere(ball1, glassInnerRadius);
    });
  }
}

function renderState(state) {
  state.forEach((ball) => {
    const drawOpts = Object.assign(
      {
        position: [0, 0, 0], 
        color: [0.5, 0, 1],
        lightColor: [0.1, 0.1, 0.1]
      },
      ball
    );

    drawBall(drawOpts);
  });
}

regl.frame(() => {
  updateState(state);

  setupScene(({time, projection, view}) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });


    // background
    drawInnerGlass({
      color: [0.03, 0.03, 0.06],
      radius: glassInnerRadius,
      lightColor: [0.1, 0.1, 0.1],
      lightIntensity: 2,
      radius: 100
    });


    drawInnerGlass({
      color: [0.03, 0.03, 0.06],
      radius: glassInnerRadius,
      lightColor: [0.1, 0.1, 0.1],
      lightIntensity: 2
    });

    renderState(state);

    drawOuterGlass({
      color: [0.2, 0.3, 0.3],
      radius: glassOuterRadius,
      lightColor: [0.1, 0.1, 0.1],
      lightIntensity: 8
    });
  });
});

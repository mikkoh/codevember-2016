const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getBall = require('./get-ball');
const getBallGlass = require('./get-ball-glass');
const vec3 = require('gl-vec3');

const setupScene = getSetupScene(regl);
const drawBall = getBall(regl);
const drawInnerGlass = getBallGlass(regl, true);
const drawOuterGlass = getBallGlass(regl);

const countBalls = 10;

const gravity = -0.1;
const friction = 0.99;
const glassInnerRadius = 15;
const glassOuterRadius = glassInnerRadius + 0.75;

const state = Array.apply(null, Array(countBalls)).map(() => {
  return {
    position: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    previousPosition: [0, gravity, 0],
    velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    radius: Math.random() * 2 + 0.3
  };
});

function boundToSphere(ball, radius) {
  const halfRadius = ball.radius * 0.5;
  const radiusDiff = radius - ball.radius;

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
     return value - ball.previousPosition[i];
    });

    ball.previousPosition = ball.position.slice();

    // add gravity
    ball.position[1] += gravity;

    // update position
    ball.position = ball.position.map((value, i) => {
      return value + ball.velocity[i];
    });
  });

  // fix collisions and bound
  state.forEach((ball1) => {
    state.forEach((ball2) => {
      if (ball1 !== ball2) {
        let dist = vec3.distance(ball1.position, ball2.position);
        dist -= ball1.radius;
        dist -= ball2.radius;

        // they are colliding
        if (dist < 0) {
          const distComponent = ball1.position.map((b1, i) => {
            return b1 - ball2.position[i];
          });

          vec3.scaleAndAdd(ball1.position, ball1.position, distComponent, dist / ball1.radius);
          vec3.scaleAndAdd(ball2.position, ball2.position, distComponent, dist / ball2.radius);
          // ball1.velocity = ball1.velocity.map(v => v * -0.99);
          // ball2.velocity = ball2.velocity.map(v => v * -0.99);
        }
      }
    });

    boundToSphere(ball1, glassInnerRadius);
  });
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

    drawInnerGlass({
      color: [0.03, 0.03, 0.06],
      radius: glassInnerRadius,
      lightColor: [0.1, 0.1, 0.1]
    });

    renderState(state);

    drawOuterGlass({
      color: [0.15, 0.23, 0.3],
      radius: glassOuterRadius,
      lightColor: [0.1, 0.1, 0.1]
    });
  });
});

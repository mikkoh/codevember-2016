const regl = require('regl')();
const getSetupScene = require('./get-setup-scene');
const getGroundPlane = require('./get-ground-plane');
const getBall = require('./get-ball');
const vec3 = require('gl-vec3');

const setupScene = getSetupScene(regl);
const drawGroundPlane = getGroundPlane(regl);
const drawBall = getBall(regl);

window.addEventListener('click', function() {
  state.forEach((ball) => {
    if(!ball.willDie) {
      const [x, z] = ball.position;
      const y = ball.y;

      vec3.scaleAndAdd(ball.velocity, [0, 0, 1], [x, y, z], 0.01);
    }
  });
});

const gravity = -0.05;
const friction = 0.99;
let maxThatWillDie = 200;

const state = Array.apply(null, Array(10)).map(() => {
  return {
    position: [Math.random() * 100 - 50, Math.random() * 100 - 50 - 200],
    y: 9,
    velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1, -1],
    scale: Math.random() * 10 + 5
  };
});

function updateState(state) {
  const toKill = [];

  state.forEach((ball, i) => {
    // update velocity
    ball.velocity = ball.velocity.map((value, i) => {
      return value * friction;
    });

    if (ball.willDie) {
      const scale = vec3.length(ball.velocity);

      if (vec3.length(ball.velocity) < 0.1) {
        toKill.push(i);
      } else {
        ball.scale = scale;
        ball.ballColor = [1 * scale, 0, 1 * (1 - scale)];
      }
    }

    ball.velocity[2] += gravity;

    // update position
    ball.position = ball.position.map((value, i) => {
      return value + ball.velocity[i];
    });

    ball.y += ball.velocity[2];

    if(ball.y < 0) {
      ball.y = 0;
      ball.velocity[2] *= -0.9;

      if(maxThatWillDie && ball.velocity[2] > 0.5) {
        let howManToBirth = Math.floor(Math.abs(ball.velocity[2]) / 0.5 * 2);

        while(maxThatWillDie && howManToBirth) {
          maxThatWillDie--;
          howManToBirth--;

          state.push({
            ballColor: [1, 0, 0],
            position: ball.position.slice(),
            y: ball.y,
            velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1, ball.velocity[2] * 0.5 * Math.random() * 1 + 0.4],
            scale: Math.random() * 2 + 1,
            willDie: true
          });
        }
      }
    }

    if(ball.position[0] < -120) {
      ball.position[0] = -120;
      ball.velocity[0] *= -1;
    }

    if(ball.position[0] > 120) {
      ball.position[0] = 120;
      ball.velocity[0] *= -1;
    }

    if(ball.position[1] < -300) {
      ball.position[1] = -300;
      ball.velocity[1] *= -1;
    }

    if(ball.position[1] > 300) {
      ball.position[1] = 300;
      ball.velocity[1] *= -1;
    }
  });

  // remove balls killed
  toKill.forEach((idxToKill) => {
    maxThatWillDie++;
    state.splice(idxToKill, 1);
  });

  // fix collisions
  state.forEach((ball1) => {
    state.forEach((ball2) => {
      if(!ball1.willDie && !ball2.willDie && ball1 !== ball2) {
        const ball1Pos = ball1.position.slice();
        const ball2Pos = ball2.position.slice();

        // we'll just drop this here cause it
        // doesn't really matter
        ball1Pos.push(ball1.y);
        ball2Pos.push(ball2.y);

        const dist = vec3.distance(ball1Pos, ball2Pos);
        const maxDist = 15 * ball1.scale / 10 + 15 * ball2.scale / 10;

        if(dist < maxDist) {
          const diff = maxDist - dist;
          const scaleToMove = diff / maxDist / 2;
          const vecDist = [];

          vec3.subtract(vecDist, ball1Pos, ball2Pos);

          vec3.scaleAndAdd(ball1Pos, ball1Pos, vecDist, scaleToMove);
          vec3.scaleAndAdd(ball2Pos, ball2Pos, vecDist, -scaleToMove);

          ball1.position = ball1Pos.slice(0, 2);
          ball1.y = ball1Pos[2];
          ball2.position = ball2Pos.slice(0, 2);
          ball1.y = ball2Pos[2];

          ball1.velocity = ball1.velocity.map(value => -value);
          ball2.velocity = ball2.velocity.map(value => -value);
        }
      }
    }); 
  }); 
}

function renderState(state) {
  state.forEach((ball) => {
    const {
      y = 0, 
      position = [0, 0], 
      scale = 1,
      groundLightColor = [0.5, 0, 0],
      ballColor = [0, 0, 1],
      lightColor = [0.1, 0.1, 0.1]
    } = ball;

    drawGroundPlane({
      position,
      scale,
      groundLightColor,
      lightColor,
      distanceToObject: y
    });
  });

  state.forEach((ball) => {
    const {
      y = 0, 
      position = [0, 0], 
      scale = 1,
      groundLightColor = [0.5, 0, 0],
      ballColor = [1, 1, 1],
      lightColor = [0.1, 0.1, 0.1]
    } = ball;

    drawBall({
      position,
      scale,
      groundLightColor,
      lightColor,
      color: ballColor,
      distanceToObject: y
    });
  });
}


regl.frame(() => {
  updateState(state);

  setupScene(({time, projection, view}) => {
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1
    });

    renderState(state);
  });
});

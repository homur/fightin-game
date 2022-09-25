export const Settings = {
  canvas: {
    width: 1920,
    height: 480,
    boundaries: {
      x: 20,
      y: 20,
    },
  },

  gameDefaults: {
    duration: 10,
  },

  playerDefaults: {
    width: 50,
    height: 150,
    gravity: 0.2,
    hitPoint: 100,
    jumpVelocity: 10,
    punchSpeed: 100, //ms
    damage: 1,
    attackBox: {
      width: 100,
      height: 50,
    },
  },

  players: {
    player1: {
      name: "PLAYER 1",
      color: "green",
      position: {
        x: 100,
        y: 200,
      },
      velocity: {
        x: 5,
        y: -10,
      },
    },
    player2: {
      name: "PLAYER 2",
      color: "blue",
      position: {
        x: 1820,
        y: 200,
      },
      velocity: {
        x: 5,
        y: -10,
      },
    },
  },

  keys: {
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    w: {
      pressed: false,
    },
    ArrowLeft: {
      pressed: false,
    },
    ArrowRight: {
      pressed: false,
    },
    ArrowDown: {
      pressed: false,
    },
    ArrowUp: {
      pressed: false,
    },
  },
};

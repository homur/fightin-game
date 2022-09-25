import { Settings } from "./utils/settings.js";
import { Game, GameStates } from "./classes/game.js";
import { Player, PlayerStates } from "./classes/player.js";
import { Sprite } from "./classes/sprite.js";
import { Utils } from "./utils/utils.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = Settings.canvas.width;
canvas.height = Settings.canvas.height;

const timerDiv = document.getElementById("timer");
const pauseDiv = document.getElementById("pauseScreen");

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },

  canvas: c,
  src: "../assets/background/background.jpg",
});

const shop = new Sprite({
  position: {
    x: 630,
    y: 128,
  },
  canvas: c,
  src: "../assets/background/shop_anim.png",
  scale: 2.2,
  framesCount: 6,
});

const player1 = new Player({
  name: Settings.players.player1.name,
  dimensions: {
    width: Settings.playerDefaults.width,
    height: Settings.playerDefaults.height,
  },
  position: {
    x: Settings.players.player1.position.x,
    y: Settings.players.player1.position.y,
  },
  velocity: {
    x: Settings.players.player1.velocity.x,
    y: Settings.players.player1.velocity.y,
  },
  color: Settings.players.player1.color,
  hitPoint: Settings.playerDefaults.hitPoint,
  weaponXOffset: 0,
  canvas: c,
});

const player2 = new Player({
  name: Settings.players.player2.name,
  dimensions: {
    width: Settings.playerDefaults.width,
    height: Settings.playerDefaults.height,
  },
  position: {
    x: Settings.players.player2.position.x,
    y: Settings.players.player2.position.y,
  },
  velocity: {
    x: Settings.players.player2.velocity.x,
    y: Settings.players.player2.velocity.y,
  },
  color: Settings.players.player2.color,
  hitPoint: Settings.playerDefaults.hitPoint,
  weaponXOffset: -50,
  canvas: c,
});

const game = new Game({
  duration: Settings.gameDefaults.duration,
  player1,
  player2,
});

const utils = new Utils({
  game,
  player1,
  player2,
  timerDiv,
  pauseDiv,
});

game.startGame();

const animate = () => {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  detectMovement();

  utils.updateTimer(timerDiv, game);
  utils.detectCollision();

  utils.detectFinish();
  utils.pauseScreen();

  player1.update();
  player2.update();

  window.requestAnimationFrame(animate);
};

const detectMovement = () => {
  if (game.state === GameStates.RUNNING) {
    // player 1 movement
    if (Settings.keys.a.pressed && player1.lastKeyPressed === "a") {
      player1.moveLeft();
      player1.state = PlayerStates.DEFENDING;
    } else if (
      Settings.keys.d.pressed &&
      player1.lastKeyPressed === "d" &&
      player1.position.x <= player2.position.x - player1.dimensions.width
    ) {
      player1.moveRight();
    }

    if (Settings.keys.w.pressed) {
      player1.jump();
    }
    if (Settings.keys.s.pressed) {
      player1.punch();
    }

    // player 2 movement
    if (
      Settings.keys.ArrowLeft.pressed &&
      player2.lastKeyPressed === "ArrowLeft" &&
      player2.position.x >= player1.position.x + player2.dimensions.width
    ) {
      player2.moveLeft();
    } else if (
      Settings.keys.ArrowRight.pressed &&
      player2.lastKeyPressed === "ArrowRight"
    ) {
      player2.moveRight();
      player2.state = PlayerStates.DEFENDING;
    }

    if (Settings.keys.ArrowUp.pressed) {
      player2.jump();
    }

    if (
      Settings.keys.ArrowDown.pressed &&
      player1.state !== PlayerStates.ATTACKING
    ) {
      player2.punch();
    }
  }
};

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "d":
      Settings.keys.d.pressed = true;
      player1.lastKeyPressed = "d";
      break;
    case "a":
      Settings.keys.a.pressed = true;
      player1.lastKeyPressed = "a";
      break;
    case "w":
      Settings.keys.w.pressed = true;
      break;
    case "s":
      Settings.keys.s.pressed = true;
      break;

    case "ArrowLeft":
      Settings.keys.ArrowLeft.pressed = true;
      player2.lastKeyPressed = "ArrowLeft";
      break;
    case "ArrowRight":
      Settings.keys.ArrowRight.pressed = true;
      player2.lastKeyPressed = "ArrowRight";
      break;
    case "ArrowUp":
      Settings.keys.ArrowUp.pressed = true;
      break;
    case "ArrowDown":
      Settings.keys.ArrowDown.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "d":
      Settings.keys.d.pressed = false;
      player1.state = PlayerStates.NEUTRAL;
      break;
    case "a":
      Settings.keys.a.pressed = false;
      player1.state = PlayerStates.NEUTRAL;
      break;
    case "s":
      Settings.keys.s.pressed = false;
      player1.state = PlayerStates.NEUTRAL;
      break;
    case "w":
      Settings.keys.w.pressed = false;
      player1.state = PlayerStates.NEUTRAL;
      break;
    case "ArrowRight":
      Settings.keys.ArrowRight.pressed = false;
      player2.state = PlayerStates.NEUTRAL;
      break;
    case "ArrowLeft":
      Settings.keys.ArrowLeft.pressed = false;
      player2.state = PlayerStates.NEUTRAL;
      break;
    case "ArrowUp":
      Settings.keys.ArrowUp.pressed = false;
      player2.state = PlayerStates.NEUTRAL;
      break;
    case "ArrowDown":
      Settings.keys.ArrowDown.pressed = false;
      player2.state = PlayerStates.NEUTRAL;
      break;
    case " ":
      if (game.state === GameStates.PAUSED) {
        game.resumeGame();
      } else if (game.state === GameStates.RUNNING) {
        game.pauseGame();
      }
  }
});

animate();

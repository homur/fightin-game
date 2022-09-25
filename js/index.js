import { Settings } from "./settings.js";
import { Game, GameStates } from "./game.js";
import { Player, PlayerStates } from "./player.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = Settings.canvas.width;
canvas.height = Settings.canvas.height;

c.fillRect(0, 0, canvas.width, canvas.height);

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
});

const game = new Game({
  duration: Settings.gameDefaults.duration,
  player1,
  player2,
});

const popup = (showPopUp) => {
  const pauseScreen = document.getElementById("pauseScreen");

  if (game.state === GameStates.FINISHED && showPopUp) {
    pauseScreen.style.display = "flex";
    game.getResults();
    pauseScreen.innerHTML = game.result;
  } else if (game.state === GameStates.PAUSED && showPopUp) {
    pauseScreen.style.display = "flex";
    pauseScreen.innerHTML = "GAME PAUSED";
  } else {
    pauseScreen.style.display = "none";
    pauseScreen.innerHTML = "";
  }
};

const draw = (player) => {
  c.fillStyle = player.color;
  c.fillRect(
    player.position.x,
    player.position.y,
    player.dimensions.width,
    player.dimensions.height
  );
  if (player.state === PlayerStates.ATTACKING) {
    c.fillStyle = "red";
    c.fillRect(
      player.attackBox.position.x,
      player.attackBox.position.y,
      player.attackBox.width,
      player.attackBox.height
    );
  }
};

game.startGame();

const animate = () => {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  document.getElementById("timer").innerHTML = game.timer;

  detectMovement();
  detectCollision();

  player1.update();
  player2.update();

  draw(player1);
  draw(player2);

  window.requestAnimationFrame(animate);
};

const detectCollision = () => {
  // player1 collision
  if (
    isColliding(player1, player2) &&
    player1.state === PlayerStates.ATTACKING
  ) {
    player2.getDamage();
    document.getElementById("player2Health").style.width =
      player2.hitPoint + "%";
  }
  //player2 collision
  if (
    isColliding(player2, player1) &&
    player2.state === PlayerStates.ATTACKING
  ) {
    player1.getDamage();
    document.getElementById("player1Health").style.width =
      player1.hitPoint + "%";
  }
};

const isColliding = (a, b) => {
  return (
    a.attackBox.position.x + a.attackBox.width > b.position.x &&
    a.attackBox.position.x < b.position.x + b.dimensions.width &&
    a.attackBox.position.y + a.attackBox.height >= b.position.y &&
    a.attackBox.position.y <= b.position.y + b.dimensions.height
  );
};

const detectMovement = () => {
  if (game.state === GameStates.RUNNING) {
    // player 1 movement
    if (Settings.keys.a.pressed && player1.lastKeyPressed === "a") {
      player1.moveLeft();
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
      break;
    case "a":
      Settings.keys.a.pressed = false;
      break;
    case "s":
      Settings.keys.s.pressed = false;
      break;
    case "w":
      Settings.keys.w.pressed = false;
      break;
    case "ArrowRight":
      Settings.keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      Settings.keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      Settings.keys.ArrowUp.pressed = false;
      break;
    case "ArrowDown":
      Settings.keys.ArrowDown.pressed = false;
      break;
    case " ":
      if (game.state === GameStates.PAUSED) {
        game.resumeGame();
        popup(false);
      } else if (game.state === GameStates.RUNNING) {
        game.pauseGame();
        popup(true);
      }
  }
});

animate();

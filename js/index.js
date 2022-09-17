import { Settings } from "./settings.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = Settings.canvas.width;
canvas.height = Settings.canvas.height;

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  lastKeyPressed;
  isJumping;
  isAttacking;

  constructor({
    position,
    dimensions,
    hitPoint,
    velocity,
    color,
    weaponXOffset,
  }) {
    this.dimensions = dimensions;
    this.position = position;
    this.velocity = velocity;
    this.color = color;
    this.hitPoint = hitPoint;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: Settings.playerDefaults.attackBox.width,
      height: Settings.playerDefaults.attackBox.height,
    };
    this.weaponXOffset = weaponXOffset;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );

    if (this.isAttacking) {
      c.fillStyle = "red";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();
    this.gravitate();

    //attach weapon to player
    this.attackBox.position.x = this.position.x + this.weaponXOffset;
    this.attackBox.position.y = this.position.y;
  }

  gravitate() {
    this.position.y += this.velocity.y;

    if (this.position.y + Settings.playerDefaults.height >= canvas.height) {
      this.isJumping = false;
      this.velocity.y = 0;
    } else {
      this.isJumping = true;
      this.velocity.y += Settings.playerDefaults.gravity;
    }
  }

  getDamage() {
    this.hitPoint -= 1;
  }

  moveRight() {
    if (
      this.position.x + this.velocity.x + Settings.playerDefaults.width <=
      canvas.width - Settings.canvas.boundaries.x
    ) {
      this.position.x += this.velocity.x;
    }
  }

  moveLeft() {
    if (this.position.x >= this.velocity.x + Settings.canvas.boundaries.x) {
      this.position.x -= this.velocity.x;
    }
  }

  jump() {
    if (this.position.y >= 0 && !this.isJumping)
      this.velocity.y -= Settings.playerDefaults.jumpVelocity;
  }

  punch() {
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, Settings.playerDefaults.punchSpeed);
  }
}

const player1 = new Sprite({
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

const player2 = new Sprite({
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

const animate = () => {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // player 1 movement
  if (Settings.keys.a.pressed && player1.lastKeyPressed === "a") {
    player1.moveLeft();
  } else if (Settings.keys.d.pressed && player1.lastKeyPressed === "d") {
    player1.moveRight();
  }

  // player 2 movement
  if (
    Settings.keys.ArrowLeft.pressed &&
    player2.lastKeyPressed === "ArrowLeft"
  ) {
    player2.moveLeft();
  } else if (
    Settings.keys.ArrowRight.pressed &&
    player2.lastKeyPressed === "ArrowRight"
  ) {
    player2.moveRight();
  }

  // player1 collision
  if (detectCollision(player1, player2) && player1.isAttacking) {
    player2.getDamage();
    document.getElementById("player2Health").style.width =
      player2.hitPoint + "%";
  }

  if (detectCollision(player2, player1) && player2.isAttacking) {
    player1.getDamage();
    document.getElementById("player1Health").style.width =
      player1.hitPoint + "%";
  }

  player1.update();
  player2.update();

  window.requestAnimationFrame(animate);
};

const detectCollision = (a, b) => {
  return (
    a.attackBox.position.x + a.attackBox.width > b.position.x &&
    a.attackBox.position.x < b.position.x + b.dimensions.width &&
    a.attackBox.position.y + a.attackBox.height >= b.position.y &&
    a.attackBox.position.y <= b.position.y + b.dimensions.height
  );
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
      player1.jump();
      break;
    case "s":
      player1.punch();
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
      player2.jump();
      break;
    case "ArrowDown":
      player2.punch();
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
    case "ArrowRight":
      Settings.keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      Settings.keys.ArrowLeft.pressed = false;
      break;
  }
});

animate();

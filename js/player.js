import { Settings } from "./settings.js";

const PlayerStates = Object.freeze({
  NEUTRAL: 1,
  ATTACKING: 2,
  DEFENDING: 3,
});

class Player {
  lastKeyPressed;
  isJumping;
  state = PlayerStates.NEUTRAL;

  constructor({
    name,
    position,
    dimensions,
    hitPoint,
    velocity,
    color,
    weaponXOffset,
  }) {
    this.name = name;
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

  update() {
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
    this.hitPoint -= Settings.playerDefaults.damage;
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
    this.state = PlayerStates.ATTACKING;

    setTimeout(() => {
      this.state = PlayerStates.NEUTRAL;
    }, Settings.playerDefaults.punchSpeed);
  }
}

export { Player, PlayerStates };

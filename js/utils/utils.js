import { GameStates } from "../classes/game.js";
import { PlayerStates } from "../classes/player.js";

class Utils {
  constructor({ game, player1, player2, timerDiv, pauseDiv }) {
    this.game = game;
    this.player1 = player1;
    this.player2 = player2;
    this.timerDiv = timerDiv;
    this.pauseDiv = pauseDiv;
  }

  updateTimer() {
    if (this.timerDiv.innerHTML != this.game.timer)
      this.timerDiv.innerHTML = this.game.timer;
  }

  detectFinish() {
    if (this.player1.hitPoint <= 0 || this.player2.hitPoint <= 0) {
      this.game.state = GameStates.FINISHED;
    }
  }

  detectCollision() {
    // player1 collision
    if (
      this.isColliding(this.player1, this.player2) &&
      this.player1.state === PlayerStates.ATTACKING &&
      this.player2.state !== PlayerStates.DEFENDING
    ) {
      this.player2.getDamage();
      document.getElementById("player2Health").style.width =
        this.player2.hitPoint + "%";
    }
    //player2 collision
    if (
      this.isColliding(this.player2, this.player1) &&
      this.player2.state === PlayerStates.ATTACKING &&
      this.player1.state !== PlayerStates.DEFENDING
    ) {
      this.player1.getDamage();
      document.getElementById("player1Health").style.width =
        this.player1.hitPoint + "%";
    }
  }

  isColliding(a, b) {
    return (
      a.attackBox.position.x + a.attackBox.width > b.position.x &&
      a.attackBox.position.x < b.position.x + b.dimensions.width &&
      a.attackBox.position.y + a.attackBox.height >= b.position.y &&
      a.attackBox.position.y <= b.position.y + b.dimensions.height
    );
  }

  pauseScreen() {
    if (this.game.state === GameStates.FINISHED) {
      this.pauseDiv.style.display = "flex";
      this.game.getResults();
      this.pauseDiv.innerHTML = this.game.result;
    } else if (this.game.state === GameStates.PAUSED) {
      this.pauseDiv.style.display = "flex";
      this.pauseDiv.innerHTML = "GAME PAUSED";
    } else {
      this.pauseDiv.style.display = "none";
      this.pauseDiv.innerHTML = "";
    }
  }
}

export { Utils };

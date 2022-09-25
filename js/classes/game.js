const GameStates = Object.freeze({
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
});

class Game {
  state;
  timer;
  timerId;
  result;

  constructor({ duration, player1, player2 }) {
    this.duration = duration;
    this.player1 = player1;
    this.player2 = player2;
  }

  startGame() {
    this.state = GameStates.RUNNING;
    this.timer = this.duration;
    this.decreaseTimer();
  }

  pauseGame() {
    this.state = GameStates.PAUSED;
  }

  resumeGame() {
    this.state = GameStates.RUNNING;
    this.decreaseTimer();
  }

  finishGame() {
    this.state = GameStates.FINISHED;
  }

  decreaseTimer() {
    if (this.timer > 0 && this.state === GameStates.RUNNING) {
      this.timer--;
      this.timerId = setTimeout(() => {
        this.decreaseTimer();
      }, 1000);
    } else if (this.timer <= 0) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.finishGame();
    }
  }

  getResults() {
    if (this.player1.hitPoint < this.player2.hitPoint) {
      this.result = this.player2.name + " WINS";
    } else if (this.player2.hitPoint < this.player1.hitPoint) {
      this.result = this.player1.name + " WINS";
    } else if (this.player1.hitPoint === this.player2.hitPoint) {
      this.result = "TIE";
    }
  }
}

export { Game, GameStates };

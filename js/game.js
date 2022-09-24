const GameStates = Object.freeze({
  RUNNING: 1,
  PAUSED: 2,
  FINISHED: 3,
});

class Game {
  state;
  timer;
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
      setTimeout(() => {
        this.decreaseTimer();
      }, 1000);
    } else if (this.timer <= 0) {
      this.result = "TIE";
      this.finishGame();
    }
  }

  detectResults() {
    if (this.state === GameStates.RUNNING) {
      if (this.player1.hitPoint <= 0) {
        this.result = this.player1.name + " WINS";
        this.finishGame();
      } else if (this.player2.hitPoint <= 0) {
        this.result = this.player2.name + " WINS";
        this.finishGame();
      }
    }
  }
}

export { Game, GameStates };
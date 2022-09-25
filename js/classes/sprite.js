class Sprite {
  constructor({ position, canvas, src, framesCount = 1, scale = 1 }) {
    this.position = position;
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = src;
    this.frames = {
      max: framesCount,
      current: 0,
      elapsed: 0,
      hold: 20,
    };

    this.scale = scale;
  }

  update() {
    this.draw();
    this.frames.elapsed++;

    if (this.frames.elapsed % this.frames.hold === 0) {
      this.frames.current < this.frames.max - 1
        ? this.frames.current++
        : (this.frames.current = 0);
    }
  }

  draw() {
    this.canvas.drawImage(
      this.image,

      //crop
      this.frames.current * (this.image.width / this.frames.max),
      0,
      this.image.width / this.frames.max,
      this.image.height,

      //width & height
      this.position.x,
      this.position.y,
      (this.image.width / this.frames.max) * this.scale,
      this.image.height * this.scale
    );
  }
}

export { Sprite };

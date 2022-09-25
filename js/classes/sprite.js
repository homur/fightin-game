class Sprite {
  constructor({ position, dimensions, canvas, src }) {
    this.dimensions = dimensions;
    this.position = position;
    this.canvas = canvas;
    this.image = new Image();
    this.image.src = src;
  }

  update() {
    this.draw();
  }

  draw() {
    this.canvas.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.dimensions.width,
      this.dimensions.height
    );
  }
}

export { Sprite };

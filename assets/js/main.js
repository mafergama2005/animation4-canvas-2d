const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const widthControl = document.getElementById("widthControl");
const heightControl = document.getElementById("heightControl");
const slider = document.getElementById("cantidad");
const efectoSelect = document.getElementById("efecto");

let window_width = parseInt(widthControl.value);
let window_height = parseInt(heightControl.value);

canvas.width = window_width;
canvas.height = window_height;

let circles = [];

class Circle {
  constructor(x, y, radius, speedX, speedY) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.dx = speedX;
    this.dy = speedY;

    this.gravity = 0.5;
    this.friction = 0.98;
    this.bounce = 0.7;
    this.stopped = false;
  }

  draw(context) {
    context.beginPath();
    context.fillStyle = "rgba(53, 238, 62, 0.3)";
    context.strokeStyle = "cyan";
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  update(context) {
    if (this.stopped) {
      this.draw(context);
      return;
    }

    this.dy += this.gravity;

    this.posX += this.dx;
    this.posY += this.dy;

    this.dx *= this.friction;

    // suelo
    if (this.posY + this.radius >= window_height) {
      this.posY = window_height - this.radius;
      this.dy *= -this.bounce;

      if (Math.abs(this.dy) < 0.5) {
        this.dy = 0;
        this.stopped = true;
      }
    }

    // paredes
    if (this.posX + this.radius >= window_width) {
      this.posX = window_width - this.radius;
      this.dx *= -this.bounce;
    }

    if (this.posX - this.radius <= 0) {
      this.posX = this.radius;
      this.dx *= -this.bounce;
    }

    // techo
    if (this.posY - this.radius <= 0) {
      this.posY = this.radius;
      this.dy *= -this.bounce;
    }

    this.draw(context);
  }
}

function crearCirculos(cantidad) {
  circles = [];
  let efecto = efectoSelect.value;

  for (let i = 0; i < cantidad; i++) {
    let radius = Math.random() * 20 + 10;
    let x, y, dx, dy;

    switch (efecto) {
      case "top-left":
        x = radius;
        y = radius;
        dx = Math.random() * 5 + 2;
        dy = Math.random() * 2;
        break;

      case "top-right":
        x = window_width - radius;
        y = radius;
        dx = -(Math.random() * 5 + 2);
        dy = Math.random() * 2;
        break;

      case "bottom-left":
        x = radius;
        y = window_height - radius;
        dx = Math.random() * 5 + 2;
        dy = -(Math.random() * 5 + 2);
        break;

      case "bottom-right":
        x = window_width - radius;
        y = window_height - radius;
        dx = -(Math.random() * 5 + 2);
        dy = -(Math.random() * 5 + 2);
        break;

      case "top":
        x = Math.random() * (window_width - 2 * radius) + radius;
        y = radius;
        dx = (Math.random() - 0.5) * 6;
        dy = 0;
        break;

      case "bottom":
        x = Math.random() * (window_width - 2 * radius) + radius;
        y = window_height - radius;
        dx = (Math.random() - 0.5) * 6;
        dy = -(Math.random() * 6);
        break;
    }

    circles.push(new Circle(x, y, radius, dx, dy));
  }
}

function update() {
  requestAnimationFrame(update);
  ctx.clearRect(0, 0, window_width, window_height);
  circles.forEach(c => c.update(ctx));
}

update();

// EVENTOS
widthControl.addEventListener("input", () => {
  window_width = parseInt(widthControl.value);
  canvas.width = window_width;
  crearCirculos(slider.value);
});

heightControl.addEventListener("input", () => {
  window_height = parseInt(heightControl.value);
  canvas.height = window_height;
  crearCirculos(slider.value);
});

slider.addEventListener("input", () => {
  crearCirculos(slider.value);
});

efectoSelect.addEventListener("change", () => {
  crearCirculos(slider.value);
});

// INICIO
crearCirculos(slider.value);
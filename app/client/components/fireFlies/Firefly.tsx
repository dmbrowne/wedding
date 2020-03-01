interface IFireflyParams {
  canvasContext: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface IFireFliesSettings {
  color: string;
  size: number;
  speed: number;
  blur: number;
  count: number;
  fadeSpeedRate: number;
  differentSize: boolean;
  isGradient: boolean;
  randomFadeTime: boolean;
}

class Firefly {
  seed: number;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  rgbColor: string;
  isGradient: boolean;
  fadeSpeedRate: number;
  randomFadeTime: boolean;
  fadeSpeed: number;
  dx: number;
  dy: number;

  constructor(canvasParams: IFireflyParams, settings: IFireFliesSettings) {
    this.seed = Math.random() + 0.4;

    this.context = canvasParams.canvasContext;
    this.width = canvasParams.width;
    this.height = canvasParams.height;

    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;

    this.speed = settings.speed;
    this.size = settings.differentSize
      ? settings.size * this.seed
      : settings.size;
    this.color = settings.color;
    this.rgbColor = this.hexToRGB(this.color);
    this.isGradient = settings.isGradient;
    this.fadeSpeedRate = settings.fadeSpeedRate;
    this.randomFadeTime = settings.randomFadeTime;
    this.fadeSpeed = 0;
    this.dx = Math.random() * 2 * (Math.random() < 0.5 ? -1 : 1);
    this.dy = Math.random() * 2 * (Math.random() < 0.5 ? -1 : 1);
  }

  move() {
    this.x += this.speed * Math.sin(this.dx);
    this.y += this.speed * Math.sin(this.dy);
    if (this.x > this.width || this.x < 0) this.dx *= -1;
    if (this.y > this.height || this.y < 0) this.dy *= -1;
  }

  buildGradientStyle(radius) {
    let style = this.context.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      radius * radius
    );
    style.addColorStop(0.0, `rgba(${this.rgbColor},1)`);
    style.addColorStop(0.1, `rgba(${this.rgbColor},0.3)`);
    style.addColorStop(1.0, `rgba(${this.rgbColor},0)`);
    return style;
  }

  show() {
    const radius = this.size * Math.abs(Math.cos(this.fadeSpeed));
    this.context.beginPath();
    this.context.arc(this.x, this.y, radius, 0, 2 * Math.PI);
    this.context.closePath();

    this.fadeSpeed +=
      this.fadeSpeedRate * (this.randomFadeTime ? this.seed : 1);
    this.context.fillStyle = this.isGradient
      ? this.buildGradientStyle(radius)
      : this.color;
    this.context.fill();
  }

  updateCanvasSize(width, height) {
    this.width = width;
    this.height = height;
    this.update();
  }

  updateSettings(settings) {
    this.speed = settings.speed;
    this.size = settings.differentSize
      ? settings.size * this.seed
      : settings.size;
    this.color = settings.color;
    this.rgbColor = this.hexToRGB(this.color);
    this.isGradient = settings.isGradient;
    this.fadeSpeedRate = settings.fadeSpeedRate;
    if (!settings.randomFadeTime) this.fadeSpeed = 0;
    this.randomFadeTime = settings.randomFadeTime;
    this.update();
  }

  update() {
    this.move();
    this.show();
  }

  hexToRGB(hex) {
    hex = parseInt(hex.replace("#", ""), 16);
    return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255].join(",");
  }
}

export default Firefly;

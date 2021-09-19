import { Canvas, Rect } from "https://deno.land/x/sdl2/src/canvas.ts";

const canvasSize = { width: 400, height: 400 };

const canvas = new Canvas({ title: "Hello, Deno!", ...canvasSize });

canvas.setDrawColor(0, 64, 255, 255);
canvas.clear();
canvas.present();

const sur = canvas.loadSurface("./sprite.png");
const texture = canvas.createTextureFromSurface(sur);

const map = [
  [8, 8, 9, 8, 11, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 8, 8],
  [8, 10, 8, 8, 8, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 8, 8],
  [8, 8, 8, 8, 8, 8, 10, 8],
  [8, 8, 8, 8, 8, 9, 8, 8],
  [10, 8, 8, 8, 8, 8, 8, 8],
  [8, 8, 11, 8, 8, 8, 8, 8],
];

const chipSize = 16;

function drawMap(texture: number, canvas: Canvas, map: number[][]) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      const chip = map[i][j];

      canvas.copy(
        texture,
        {
          x: (chip % 4) * chipSize,
          y: ((chip / 4) | 0) * chipSize,
          width: chipSize,
          height: chipSize,
        },
        {
          x: j * chipSize * 4,
          y: i * chipSize * 4,
          width: chipSize * 4,
          height: chipSize * 4,
        }
      );
    }
  }
}

class Sprite {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  originX = 0;
  originY = 0;
  scale = 1;
  texture: number;
  frames: Rect[];
  index = 0;

  constructor(texture: number, frames: Rect[]) {
    this.texture = texture;
    this.frames = frames;
  }

  draw(dest: Canvas) {
    dest.copy(this.texture, this.frames[this.index], {
      x: this.x - this.originX,
      y: this.y - this.originY,
      width: this.frames[this.index].width * this.scale,
      height: this.frames[this.index].height * this.scale,
    });
  }

  tick() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

const deno = new Sprite(texture, [
  { x: 0, y: 0, width: 16, height: 16 },
  { x: 16, y: 0, width: 16, height: 16 },
  { x: 32, y: 0, width: 16, height: 16 },
  { x: 48, y: 0, width: 16, height: 16 },
]);
deno.originX = deno.frames[0].width / 2;
deno.originY = deno.frames[0].height;
deno.x = 100;
deno.y = 100;
deno.scale = 4;
deno.vx = 1;

function frame() {
  canvas.clear();
  drawMap(texture, canvas, map);
  deno.draw(canvas);
  if (deno.x > 400 + 8 * 4) {
    deno.x = -8 * 4;
  }
  if (deno.vx > 0) {
    deno.index = 2;
  }
  canvas.present();
  deno.tick();
  Deno.sleepSync(10);
}

for await (const event of canvas) {
  switch (event.type) {
    case "draw":
      frame();
      break;
    case "quit":
      canvas.quit();
      break;
    case "mouse_motion":
      // Mouse stuff
      break;
    case "key_down":
      // Keyboard stuff
      break;
    // ...
    default:
      break;
  }
}

import { Canvas, Rect } from "https://deno.land/x/sdl2/src/canvas.ts";
// import { PixelFormat } from "https://deno.land/x/sdl2/src/pixel.ts";

const canvas = new Canvas({ title: "Hello, Deno!", width: 400, height: 400 });

canvas.setDrawColor(0, 64, 255, 255);
canvas.clear();
canvas.present();

const sur = canvas.loadSurface("./sprite.png");
const texture = canvas.createTextureFromSurface(sur);
const deno = {
  x: 0,
  y: 0,
  vx: 1,
  vy: 1,
}


async function frame(){
  canvas.clear();
  canvas.copy(
    texture,
    { x: 0, y: 0, width: 32, height: 32 },
    { x: deno.x, y: deno.y, width: 64, height: 64 }
  );
  canvas.present();
  deno.x += deno.vx;
  deno.y += deno.vy;
  Deno.sleepSync(10);
}

for await (const event of canvas) {
  switch (event.type) {
    case "draw":
      await frame();
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

import { Application, ColorMatrixFilter } from 'pixi.js';
import { bindKeyboard } from './keyboard';
import { createStatus } from './status';
import { preload } from './spritesheet';
import { Player } from './player';
import { Medusa } from './enemies/medusa';

(async () => {
  // Create a new application
  const app = new Application();

  const filter = new ColorMatrixFilter();
  filter.greyscale(1, false);
  filter.matrix = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];

  app.stage.filters = [filter];

  await preload();

  const status = await createStatus();

  const player = new Player(app.stage);
  const sprite1 = new Medusa();
  sprite1.sprite.x += 1020;
  sprite1.sprite.y += 330;

  const sprite2 = new Medusa();
  sprite2.sprite.x += 1020;

  const keys = bindKeyboard();

  // Initialize the application
  await app.init({ background: 'black', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  app.stage.addChild(sprite1.sprite);
  app.stage.addChild(sprite2.sprite);
  app.stage.addChild(player.sprite);
  app.stage.addChild(status);

  // Listen for animate update
  app.ticker.add((time) => {
    const moveDir = keys.ArrowUp ? -1 : keys.ArrowDown ? 1 : 0;
    player.sprite.y += moveDir * 10 * time.deltaTime;
    player.update(time.deltaTime);
    if (keys.Space) {
      player.shoot();
    }
  });
})();

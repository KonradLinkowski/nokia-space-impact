import { Application, ColorMatrixFilter } from 'pixi.js';
import { bindKeyboard } from './keyboard';
import { Status } from './status';
import { preload } from './spritesheet';
import { Player } from './player';
import { EnemySpawner } from './enemies/enemy';
import { CollisionsManager } from './collisions';

(async () => {
  // Create a new application
  const app = new Application();

  const filter = new ColorMatrixFilter();
  filter.greyscale(1, false);
  filter.matrix = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];

  app.stage.filters = [filter];

  await preload();

  const status = new Status(app.stage);

  status.loseHealth(1);

  const player = new Player(app.stage);

  const spawner = new EnemySpawner(app.stage);

  const keys = bindKeyboard();

  // Initialize the application
  await app.init({ background: 'black', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  app.stage.addChild(player.sprite);

  spawner.spawn();

  // Listen for animate update
  app.ticker.add((time) => {
    const moveDir = keys.ArrowUp ? -1 : keys.ArrowDown ? 1 : 0;
    player.sprite.y += moveDir * 10 * time.deltaTime;
    player.update(time.deltaTime);
    spawner.update(time.deltaTime);
    if (keys.Space) {
      player.shoot();
    }
    CollisionsManager.instance.update();
  });
})();

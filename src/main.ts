import { Application, ColorMatrixFilter, Container, Sprite } from 'pixi.js';
import { bindKeyboard } from './keyboard';
import { Status } from './status';
import { getTexture, preload } from './spritesheet';
import { Player } from './player';
import { EnemySpawner } from './enemies/enemy';
import { CollisionsManager } from './collisions';

const PLAYABLE_AREA_HEIGHT = 50;

(async () => {
  // Create a new application
  const app = new Application();

  const filter = new ColorMatrixFilter();
  filter.greyscale(1, false);
  filter.matrix = [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];

  app.stage.filters = [filter];
  await preload();

  Status.instance.init(app.stage);

  const gameContainer = new Container();
  gameContainer.scale.set(16);

  app.stage.addChild(gameContainer);
  gameContainer.y = 200;

  const bg = new Sprite(getTexture('level-1'));
  bg.y = PLAYABLE_AREA_HEIGHT - bg.height;
  gameContainer.addChild(bg);

  const player = new Player(gameContainer);
  console.log(player.sprite.y);

  const spawner = new EnemySpawner(gameContainer);

  const keys = bindKeyboard();

  const htmlContainer = document.getElementById('pixi-container')!;

  // Initialize the application
  await app.init({
    background: 'black',
    width: 1500,
    height: 1000,
    antialias: false,
  });

  // Append the application canvas to the document body
  htmlContainer.appendChild(app.canvas);

  // Listen for animate update
  app.ticker.add((time) => {
    player.update(time.deltaTime, keys);
    spawner.update(time.deltaTime);

    CollisionsManager.instance.update();
  });
})();

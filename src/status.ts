import { createSprite } from '@/sprite';
import { getTexture } from '@/spritesheet';
import { Container } from 'pixi.js';

export async function createStatus() {
  const hp = 3;
  const texture = await getTexture('heart');
  const health = new Container();
  for (let i = 0; i < hp; i += 1) {
    const sprite = await createSprite(texture);
    sprite.anchor.set(0.15, 0.15);
    sprite.x = (sprite.width / 2) * i;
    health.addChild(sprite);
  }

  health.scale.set(16);

  return health;
}

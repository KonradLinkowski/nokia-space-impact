import { Sprite } from 'pixi.js';

export type Collidable = {
  sprite: Sprite;
  type: 'player' | 'bullet' | 'enemy';
  collide(other: Collidable): void;
};

export function areColliding(a: Collidable, b: Collidable) {
  const aBounds = a.sprite.getBounds();
  const bBounds = b.sprite.getBounds();

  return (
    aBounds.x < bBounds.x + bBounds.width &&
    aBounds.x + aBounds.width > bBounds.x &&
    aBounds.y < bBounds.y + bBounds.height &&
    aBounds.y + aBounds.height > bBounds.y
  );
}

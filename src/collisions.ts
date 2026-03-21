import { Sprite } from 'pixi.js';

type Type = Collidable['type'];

export type Collidable = {
  id: string;
  sprite: Sprite;
  type: 'player' | 'bullet' | 'enemy';
  collide(wth: Collidable): void;
};

type CollisionHandler = (a: Collidable, b: Collidable) => void;

// Sorted
const collisionMatrix: Record<Type, Partial<Record<Type, CollisionHandler>>> = {
  bullet: {
    bullet: noop,
    enemy: (bullet, enemy) => {
      bullet.collide(enemy);
      enemy.collide(bullet);
    },
    player: noop,
  },
  enemy: {
    player: (enemy, player) => {
      enemy.collide(player);
      player.collide(enemy);
    },
  },
  player: {},
};

export function areColliding(a: Collidable, b: Collidable) {
  if (a.sprite.destroyed || b.sprite.destroyed) return false;
  const aBounds = a.sprite.getBounds();
  const bBounds = b.sprite.getBounds();

  return (
    aBounds.x < bBounds.x + bBounds.width &&
    aBounds.x + aBounds.width > bBounds.x &&
    aBounds.y < bBounds.y + bBounds.height &&
    aBounds.y + aBounds.height > bBounds.y
  );
}

export class CollisionsManager {
  collidables: Collidable[] = [];
  static instance = new CollisionsManager();

  register(object: Collidable) {
    this.collidables.push(object);
    return (id: string) => {
      const index = this.collidables.findIndex((c) => c.id === id);
      this.collidables.splice(index, 1);
    };
  }

  update() {
    for (const a of this.collidables) {
      for (const b of this.collidables) {
        if (a === b) continue;
        if (!areColliding(a, b)) continue;
        const [sortedA, sortedB] = [a, b].sort((a, b) =>
          a.type.localeCompare(b.type),
        );
        collisionMatrix[sortedA.type][sortedB.type]?.(sortedA, sortedB);
      }
    }
  }
}

function noop() {}

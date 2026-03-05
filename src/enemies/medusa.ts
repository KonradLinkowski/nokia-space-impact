import { Enemy } from './enemy';
import { getSpritesheet } from '@/spritesheet';
import { createAnimatedSprite } from '@/sprite';
import { CollisionsManager } from '@/collisions';

export class Medusa implements Enemy {
  id = crypto.randomUUID();
  type = 'enemy' as const;
  sprite = createAnimatedSprite(getSpritesheet('medusa'));
  #handleDelete: (id: string) => void;
  constructor() {
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
    this.sprite.scale.set(16);
    this.#handleDelete = CollisionsManager.instance.register(this);
  }

  takeDamage() {
    this.#handleDelete(this.id);
    this.sprite.destroy();
  }

  update(deltaTime: number): void {
    if (this.sprite.destroyed) return;
    this.sprite.x -= deltaTime;
  }
}

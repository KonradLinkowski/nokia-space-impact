import { Enemy } from './enemy';
import { getTexture } from '@/spritesheet';
import { Collidable, CollisionsManager } from '@/collisions';
import { Sprite } from 'pixi.js';
import { Status } from '@/status';

export class Boss1 implements Enemy {
  id = crypto.randomUUID();
  type = 'enemy' as const;
  sprite = new Sprite(getTexture('boss-1'));
  #hp = 20;
  #dir = 1;
  #handleDelete: (id: string) => void;
  constructor(onDestroy: (id: string) => void) {
    const unregister = CollisionsManager.instance.register(this);
    this.#handleDelete = () => {
      onDestroy(this.id);
      unregister(this.id);
    };
  }

  collide(wth: Collidable): void {
    if (wth.type !== 'bullet') return;
    this.#hp -= 1;
    if (this.#hp <= 0) {
      this.#handleDelete(this.id);
      this.sprite.destroy();
      Status.instance.gainPoints(100);
    }
  }

  update(deltaTime: number): void {
    if (this.sprite.destroyed) return;
    if (this.sprite.y > 25) {
      this.#dir = -1;
    } else if (this.sprite.y < 0) {
      this.#dir = 1;
    }
    this.sprite.y += this.#dir * deltaTime * 0.2;
  }
}

import { Enemy } from './enemy';
import { getSpritesheet } from '@/spritesheet';
import { createAnimatedSprite } from '@/sprite';
import { Collidable, CollisionsManager } from '@/collisions';
import { sound } from '@pixi/sound';
import { Status } from '@/status';

export class Medusa implements Enemy {
  id = crypto.randomUUID();
  type = 'enemy' as const;
  sprite = createAnimatedSprite(getSpritesheet('medusa'));
  #hp = 2;
  #handleDelete: (id: string) => void;
  constructor(onDestroy: (id: string) => void) {
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
    const unregister = CollisionsManager.instance.register(this);
    this.#handleDelete = () => {
      Status.instance.gainPoints(10);
      sound.play('boom');
      onDestroy(this.id);
      unregister(this.id);
    };
  }

  collide(wth: Collidable): void {
    if (wth.type === 'player') {
      this.#handleDelete(this.id);
      this.sprite.destroy();
      return;
    }
    if (wth.type !== 'bullet') return;
    this.#hp -= 1;
    if (this.#hp <= 0) {
      this.#handleDelete(this.id);
      this.sprite.destroy();
    }
  }

  update(deltaTime: number): void {
    if (this.sprite.destroyed) return;
    this.sprite.x -= deltaTime * 0.5;
  }
}

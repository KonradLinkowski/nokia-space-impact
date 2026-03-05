import { Container, Sprite } from 'pixi.js';
import { getTexture } from '@/spritesheet';
import { Collidable, CollisionsManager } from './collisions';

type DestroyHandler = (id: ReturnType<typeof crypto.randomUUID>) => void;

export class Player implements Collidable {
  id = crypto.randomUUID();
  type = 'player' as const;
  sprite = new Sprite(getTexture('player'));
  bullets: Bullet[] = [];

  #lastShotTime = 0;
  #handleDelete: (id: string) => void;

  constructor(private scene: Container) {
    this.sprite.scale.set(16);
    this.sprite.y += 100;
    this.#handleDelete = CollisionsManager.instance.register(this);
  }

  update(deltaTime: number) {
    this.bullets.forEach((v) => v.update(deltaTime));
  }

  shoot() {
    const now = performance.now();
    if (now - this.#lastShotTime > 300) {
      this.#lastShotTime = now;
      this.#shoot();
    }
  }

  #shoot() {
    const handleDestroy: DestroyHandler = (id) => {
      const index = this.bullets.findIndex((b) => b.id === id);
      this.bullets.splice(index, 1);
    };
    const bullet = new Bullet(this.scene, handleDestroy);
    bullet.sprite.x = this.sprite.x + 100;
    bullet.sprite.y = this.sprite.y;
    this.bullets.push(bullet);
  }

  takeDamage() {
    this.#handleDelete(this.id);
  }
}

class Bullet implements Collidable {
  type = 'bullet' as const;
  id = crypto.randomUUID();
  sprite = new Sprite(getTexture('bullet'));
  #handleDelete: (id: string) => void;

  constructor(
    private scene: Container,
    private onDestroy: DestroyHandler
  ) {
    this.sprite.scale.set(16);
    this.scene.addChild(this.sprite);
    this.#handleDelete = CollisionsManager.instance.register(this);
  }

  update(deltaTime: number) {
    this.sprite.x += deltaTime * 10;
  }

  takeDamage() {
    this.sprite.destroy();
    this.onDestroy(this.id);
    this.#handleDelete(this.id);
  }
}

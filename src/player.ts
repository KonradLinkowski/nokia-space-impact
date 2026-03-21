import { Container, Sprite } from 'pixi.js';
import { getTexture } from '@/spritesheet';
import { Collidable, CollisionsManager } from './collisions';
import { Status } from './status';
import { sound } from '@pixi/sound';

type DestroyHandler = (id: ReturnType<typeof crypto.randomUUID>) => void;

export class Player implements Collidable {
  id = crypto.randomUUID();
  type = 'player' as const;
  sprite = new Sprite(getTexture('player'));
  bullets: Bullet[] = [];

  #lastShotTime = 0;
  #handleDelete: (id: string) => void;

  constructor(private scene: Container) {
    this.scene.addChild(this.sprite);
    this.sprite.anchor.set(0, 0.5);
    this.#handleDelete = CollisionsManager.instance.register(this);
  }

  update(deltaTime: number, keys: Record<string, boolean>) {
    const moveDir = keys.ArrowUp ? -1 : keys.ArrowDown ? 1 : 0;
    this.sprite.y += moveDir * 0.5 * deltaTime;
    if (this.sprite.y < 0) {
      this.sprite.y = 0;
    } else if (this.sprite.y > 40) {
      this.sprite.y = 40;
    }
    if (keys.Space) {
      this.shoot();
    }
    this.bullets.forEach((v) => v.update(deltaTime));
  }

  shoot() {
    const now = performance.now();
    if (now - this.#lastShotTime > 200) {
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
    bullet.sprite.x = this.sprite.x + 8;
    bullet.sprite.y = this.sprite.y - 0.5;
    this.bullets.push(bullet);
    const soundIndex = Math.floor(Math.random() * 5);
    sound.play(`bullet${soundIndex}`);
  }

  collide() {
    Status.instance.loseHealth(1);
    if (Status.instance.hp <= 0) {
      this.sprite.destroy();
      this.#handleDelete(this.id);
    }
  }
}

class Bullet implements Collidable {
  type = 'bullet' as const;
  id = crypto.randomUUID();
  sprite = new Sprite(getTexture('bullet'));
  #handleDelete: (id: string) => void;

  constructor(
    private scene: Container,
    private onDestroy: DestroyHandler,
  ) {
    this.scene.addChild(this.sprite);
    this.#handleDelete = CollisionsManager.instance.register(this);
  }

  update(deltaTime: number) {
    this.sprite.x += deltaTime * 0.5;
  }

  collide() {
    this.sprite.destroy();
    this.onDestroy(this.id);
    this.#handleDelete(this.id);
  }
}

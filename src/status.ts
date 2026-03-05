import { createSprite } from '@/sprite';
import { getTexture } from '@/spritesheet';
import { Container } from 'pixi.js';

export class Status {
  #hp = 3;
  #heartContainer = new Container();
  static #instance?: Status;

  constructor(private scene: Container) {
    this.#renderHealth();

    this.#heartContainer.scale.set(16);
    this.scene.addChild(this.#heartContainer);
  }

  static get instance(): Status {
    if (!this.#instance) throw new Error('Status not initialized');
    return this.#instance;
  }

  loseHealth(damage: number) {
    this.#hp -= damage;
    this.#renderHealth();
  }

  #renderHealth() {
    const hearts = this.#heartContainer.children;
    const currentHeartCount = hearts.length;
    if (this.#hp < currentHeartCount) {
      for (let i = this.#hp; i < currentHeartCount; i += 1) {
        hearts[i].destroy();
      }
    } else if (this.#hp > currentHeartCount) {
      for (let i = currentHeartCount; i < this.#hp; i += 1) {
        const heart = this.#createHeart();
        heart.x = (heart.width / 2) * i;
      }
    }
  }

  #createHeart() {
    const texture = getTexture('heart');
    const sprite = createSprite(texture);
    sprite.anchor.set(0.15, 0.15);
    this.#heartContainer.addChild(sprite);
    return sprite;
  }
}

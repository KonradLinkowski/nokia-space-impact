import { Enemy } from './enemy';
import { getSpritesheet } from '@/spritesheet';
import { createAnimatedSprite } from '@/sprite';

export class Medusa implements Enemy {
  sprite = createAnimatedSprite(getSpritesheet('medusa'));
  constructor() {
    this.sprite.animationSpeed = 0.1;
    this.sprite.play();
    this.sprite.scale.set(16);
  }
}

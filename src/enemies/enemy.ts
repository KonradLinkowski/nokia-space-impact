import { Collidable } from '@/collisions';
import { Container, Sprite } from 'pixi.js';
import { Medusa } from './medusa';

export interface Enemy extends Collidable {
  sprite: Sprite;
  update(deltaTime: number): void;
}

export class EnemySpawner {
  enemies: Enemy[] = [];

  constructor(private scene: Container) {}

  update(deltaTime: number) {
    this.enemies.forEach((e) => e.update(deltaTime));
  }

  spawn() {
    // const handleDestroy = (id)
    const enemy = new Medusa();
    enemy.sprite.x += 1020;
    enemy.sprite.y += 330;
    this.enemies.push(enemy);
    this.scene.addChild(enemy.sprite);
  }
}

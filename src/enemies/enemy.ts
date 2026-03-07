import { Collidable } from '@/collisions';
import { Container, Sprite } from 'pixi.js';
import { Medusa } from './medusa';
import { Boss1 } from './boss1';

export interface Enemy extends Collidable {
  sprite: Sprite;
  update(deltaTime: number): void;
}

export class EnemySpawner {
  enemies: Enemy[] = [];

  #spawnTimer = Infinity;
  #spawnCounter = 0;

  #isBossSpawned = false;

  constructor(private scene: Container) {}

  update(deltaTime: number) {
    this.enemies.forEach((e) => e.update(deltaTime));
    this.#spawnTimer += deltaTime;
    if (!this.#isBossSpawned && this.#spawnTimer > 200) {
      this.#spawnTimer = 0;
      if (this.#spawnCounter === 1) {
        this.#spawnCounter = 0;
        this.spawnBoss();
      } else {
        this.#spawnCounter += 1;
        this.spawnEnemy();
      }
    }
  }

  spawnBoss() {
    this.#isBossSpawned = true;
    const handleDestroy = (id: string) => {
      const index = this.enemies.findIndex((e) => e.id === id);
      this.enemies.splice(index, 1);
    };
    const enemy = new Boss1(handleDestroy);
    enemy.sprite.x += 70;
    enemy.sprite.y += 20;
    this.enemies.push(enemy);
    this.scene.addChild(enemy.sprite);
  }

  spawnEnemy() {
    const handleDestroy = (id: string) => {
      const index = this.enemies.findIndex((e) => e.id === id);
      this.enemies.splice(index, 1);
    };
    const enemy = new Medusa(handleDestroy);
    enemy.sprite.x += 100;
    enemy.sprite.y += Math.random() * 40;
    this.enemies.push(enemy);
    this.scene.addChild(enemy.sprite);
  }
}

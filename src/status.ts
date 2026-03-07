import { Container, Text } from 'pixi.js';

const style = {
  fill: '#ffffff',
  fontSize: 80,
  fontFamily: 'font',
  padding: 100,
  lineHeight: 50,
};

export class Status {
  #hp = 3;
  #heartsText = new Text({
    text: '@@@',

    style,
  });

  #bombs = 0;
  #bombsText = new Text({
    text: '00',

    style: {
      ...style,
      letterSpacing: -25,
    },
  });

  #score = 0;
  #scoreText = new Text({
    text: '000000',

    style: {
      ...style,
      letterSpacing: -25,
    },
  });

  static instance = new Status();

  init(scene: Container) {
    this.#renderHealth();
    this.#renderScore();
    this.#renderBombs();

    scene.addChild(this.#heartsText);

    this.#bombsText.x = 800;
    scene.addChild(this.#bombsText);

    this.#scoreText.x = 1000;
    scene.addChild(this.#scoreText);
  }

  gainPoints(points: number) {
    this.#score += points;
    this.#renderScore();
  }

  loseHealth(damage: number) {
    this.#hp -= damage;
    this.#renderHealth();
  }

  #renderHealth() {
    this.#heartsText.text = '@'.repeat(this.#hp);
  }

  #renderScore() {
    this.#scoreText.text = this.#score.toString().padStart(6, '0');
  }

  #renderBombs() {
    this.#bombsText.text = this.#bombs.toString().padStart(2, '0');
  }
}

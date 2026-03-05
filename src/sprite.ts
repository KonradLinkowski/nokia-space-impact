import { AnimatedSprite, Sprite, Texture, type Spritesheet } from 'pixi.js';

export function createSprite(texture: Texture) {
  return new Sprite({
    texture,
  });
}

export function createAnimatedSprite(sheet: Spritesheet) {
  return new AnimatedSprite(Object.values(sheet.textures));
}

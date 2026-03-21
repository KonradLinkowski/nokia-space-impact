import { Assets, Texture, type Spritesheet } from 'pixi.js';
import { sound } from '@pixi/sound';

const assets = {
  player: 'texture',
  bullet: 'texture',
  heart: 'texture',
  medusa: 'spritesheet',
  'level-1': 'texture',
  'boss-1': 'texture',
} satisfies Record<string, 'texture' | 'spritesheet'>;

type AssetName = keyof typeof assets;

export async function preload() {
  await Assets.load([
    { alias: 'font', src: '/assets/font.otf' },
    ...Object.entries(assets).map(([alias, type]) => ({
      alias,
      src:
        type === 'texture'
          ? `/assets/${alias}.png`
          : `/assets/${alias}/sprite.json`,
    })),
  ]);

  for (let i = 0; i < 5; i += 1) {
    sound.add(`bullet${i}`, `/assets/bullet/bullet${i}.ogg`);
  }
  sound.add('boom', '/assets/boom.ogg');
}

export function getTexture(name: AssetName) {
  const texture = Assets.get<Texture>(name);
  texture.source.scaleMode = 'nearest';
  return texture;
}

export function getSpritesheet(name: AssetName) {
  const sheet = Assets.get<Spritesheet>(name);
  sheet.textureSource.scaleMode = 'nearest';
  return sheet;
}

import 'phaser';
import { CardGroup } from './entities/CardGroup';

const HEIGHT : number = 800;
const WIDTH  : number = 1000;

export default class Demo extends Phaser.Scene {
  constructor() {
    super({ key: 'demo', active: true });
  }

  preload() {
    let cg : CardGroup = new CardGroup(this, WIDTH/2, HEIGHT - 150, 8, {
      space: 40,
      shift: 55,
      popup: 25,
    });
  }

  create() {
  }

  update() {
  }
}

export class Shop extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  preload() {
    this.add.text(100, 100, 'Yes');
  }

  create() {
  }

  update() {
  }
}

const config = {
    type: Phaser.WEBGL,
    backgroundColor: '#125555',
    width: WIDTH,
    height: HEIGHT,
    scene: [ Demo ]
};

const game = new Phaser.Game(config);

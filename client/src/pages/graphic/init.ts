import 'phaser';
import { Popup } from './entities/Popup';
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

    let shop : Shop = new Shop();
    shop.registerToScenePlugin(this.scene);
    shop.show();
  }
}

export class Shop extends Popup {
  constructor() {
    super('Shop');
  }

  create() {
    this.add.text(100, 100, 'Yes');
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

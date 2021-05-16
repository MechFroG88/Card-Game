import * as Phaser from 'phaser';
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

    this.input.keyboard.on('keydown-' + 'S', () => {
      cg.permuteCards([7,1,6,3,0,5,2,4])
    });

    this.input.keyboard.on('keydown-' + 'A', () => {
      cg.addCard(3);
    });
  }
}

export class Shop extends Popup {
  constructor() {
    super('Shop');
  }

  preload() {
    this.drawOverlay(WIDTH, HEIGHT);

    this.drawWindow(WIDTH/2, HEIGHT/2, 400, 250, 0x551255);

    let text : Phaser.GameObjects.Text = this.add.text(100, 100, 'Yes');
    text.setInteractive();
    text.on('pointerdown', () => {
      this.hide();
    });
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

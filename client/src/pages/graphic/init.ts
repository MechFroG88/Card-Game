import 'phaser';
import { Card, CardGroup } from './entities/Card';

const HEIGHT : number = 800;
const WIDTH  : number = 1000;

export default class Demo extends Phaser.Scene {
  private card : Card;
  
  constructor() {
    super('demo');
  }

  preload() {
    let cg : CardGroup = new CardGroup(this, WIDTH/2, HEIGHT - 150, 8, {
      space: 40,
      shift: 55,
      popup: 30,
    });
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
    scene: Demo
};

const game = new Phaser.Game(config);

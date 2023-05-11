import { Container, Graphics, Text } from 'pixi.js';


import { Recording } from 'InteractivePiano/Recording'

const radius = 50;
export default class Circle extends Container {
  constructor() {
    super();
    this.interactive = true;
    this.buttonMode=  true;



    const bg = new Graphics();
    bg.beginFill(0xffffff);
    bg.drawCircle(0, 0, radius);
    bg.endFill();
    this.addChild(bg);

    this.label = new Text('', { fontSize: 16, fill: 'green' });
    this.label.y = -8;
    this.addChild(this.label);
  }

  set count(value) {
    this.label.text = value;
    this.label.x = -this.label.width / 2;
  }
}
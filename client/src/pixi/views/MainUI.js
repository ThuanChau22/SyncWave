import { Container } from 'pixi.js';
import Circle from './Circle';

export default class MainUI extends Container {
  constructor() {
    super();
    this.circle1 = new Circle();
    this.circle1.x = 100;
    this.circle1.y = 100;
    this.addChild(this.circle1);

    this.circle2 = new Circle();
    this.circle2.x = 300;
    this.circle2.y = 100;
    this.addChild(this.circle2);
  }

}
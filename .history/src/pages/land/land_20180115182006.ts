import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public levelNumber: number;

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
      this.levelNumber = 10;
    });
  }

  goToMain() {
    this.navCtrl.push(HomePage, {
      levelNumber: this.levelNumber
    });
  }

}

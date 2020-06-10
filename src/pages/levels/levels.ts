import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-levels',
  templateUrl: 'levels.html'
})
export class LevelsPage {

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {

    });
  }

}

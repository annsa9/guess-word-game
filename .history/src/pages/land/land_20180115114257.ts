import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {

    });
  }

}

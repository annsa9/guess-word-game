import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html'
})

export class HintPage {

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
      
    });
  }

}

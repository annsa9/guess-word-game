import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html'
})

export class HintPage {

  constructor(public navCtrl: NavController, public platform: Platform, public viewCtrl: ViewController) {
    this.platform.ready().then(() => {
      
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

import { Component } from '@angular/core';
import { NavController, Platform, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {

  constructor(public navCtrl: NavController, public platform: Platform, public viewCtrl: ViewController) {
    this.platform.ready().then(() => {

    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
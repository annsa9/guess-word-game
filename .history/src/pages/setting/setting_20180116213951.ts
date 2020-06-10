import { Component } from '@angular/core';
import { NavController, Platform, ViewController} from 'ionic-angular';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {
  public credit: boolean;
  public isSound: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController) {
    this.platform.ready().then(() => {

    });
  }

  changeSound() {
    this.isSound = !this.isSound;
    console.log('this.isSound', this.isSound);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  showCredits() {
    this.credit = true;
  }

  cancelCredit() {
    this.credit = false;
  }
}
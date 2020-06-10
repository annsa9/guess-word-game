import { Component } from '@angular/core';
import { NavController, Platform, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {
  public credit: boolean;
  public isSound: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController,
              public storage: Storage) {
    this.platform.ready().then(() => {
      this.checkSoundEnabled();
    });
  }

  checkSoundEnabled() {
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
    });
  }

  changeSound() {
    this.isSound = !this.isSound;
    this.storage.set('isSound', this.isSound);
    console.log(this.isSound);
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
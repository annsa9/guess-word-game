import { Component } from '@angular/core';
import { NavController, Platform, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {

  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {

    });
  }

}
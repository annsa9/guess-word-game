import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions } from 'ionic-angular';

import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public levelNumber: number;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController) {
    this.platform.ready().then(() => {
      this.levelNumber = 0;
    });
  }

  goToMain() {
    this.navCtrl.push(HomePage, {
      levelNumber: this.levelNumber
    });
  }

  showSetting() {
    let settingOptions: ModalOptions ={

    };
    let settingModal = this.modalCtrl.create(SettingPage);
    settingModal.present();
  }

}

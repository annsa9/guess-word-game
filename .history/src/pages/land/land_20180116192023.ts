import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public levelNumber: number;
  public isSound: boolean = true;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
              private nativeAudio: NativeAudio) {
    this.platform.ready().then(() => {
      this.levelNumber = 0;
      this.loadSounds();
      if (this.isSound) {
        this.nativeAudio.loop('game_start').then((onSuccess) => { }, (onError) => { });
      }
    });
  }

  loadSounds() {
    this.nativeAudio.preloadSimple('game_start', 'assets/sounds/start.wav').then((onSuccess) => {}, (onError) => {});
    this.nativeAudio.preloadComplex('game_theme', 'assets/sounds/8_string_ballad', 0.9, 0, 0).then((onSuccess) => {}, (onError) => {});
  }

  goToMain() {
    if (this.isSound) {
      this.nativeAudio.play('game_start').then((onSuccess) => { }, (onError) => { });
    }
    this.navCtrl.push(HomePage, {
      levelNumber: this.levelNumber
    });
  }

  showSetting() {
    const settingOptions: ModalOptions ={
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    let settingModal = this.modalCtrl.create(SettingPage, {}, settingOptions);
    settingModal.present();
  }

}

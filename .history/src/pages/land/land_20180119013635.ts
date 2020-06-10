import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public levelNumber: number;
  public isSound: boolean;
  public isAd: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
    private nativeAudio: NativeAudio, public storage: Storage, private ads: Ads) {
    this.platform.ready().then(() => {
      this.levelNumber = 0;
      this.storage.set('isSound', true);
      this.storage.set('isAd', true);

      this.checkRemoveAds();
      this.checkSoundEnabled();
      this.loadSounds();

      if (this.isAd) {
        this.ads.showAdmobBannerAdMob();
      }
    });
  }

  checkRemoveAds() {
    this.storage.get('isAd').then((val) => {
      console.log('isAd is', val);
      this.isAd = val;
    });
  }

  loadSounds() {
    this.nativeAudio.preloadSimple('game_start', 'assets/sounds/start.wav').then((onSuccess) => {}, (onError) => {});
    this.nativeAudio.preloadSimple('game_theme', 'assets/sounds/8_string_ballad.mp3').then((onSuccess) => {
      console.log(onSuccess);
      if (this.isSound) {
        this.nativeAudio.loop('game_theme').then((onSuccess) => { }, (onError) => { });
      }
    }, (onError) => {});
  }

  checkSoundEnabled() {
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
    });
  }

  goToMain() {
    this.storage.get('isSound').then((val) => {
      this.isSound = val;
      if (this.isSound) {
        this.nativeAudio.stop('game_theme').then((onSuccess) => { }, (onError) => { });
        this.nativeAudio.play('game_start').then((onSuccess) => { }, (onError) => { });
      }
    });

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

  ionViewDidEnter () {
    this.storage.get('isAd').then((val) => {
      console.log('isAd is', val);
      this.isAd = val;
      if (this.isAd) {
        this.ads.showAdmobBannerAdMob();
      }
    });
    
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
      if (this.isSound) {
        this.nativeAudio.loop('game_theme').then((onSuccess) => { }, (onError) => { });
      }   
    }); 
  }
}

import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions, Events } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

import * as _ from "lodash";
import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public items: AngularFireObject<any>;
  public levelNumber: number;
  public isSound: boolean = true;
  public isAd: boolean;
  public itemsRef: AngularFireList<any>;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
              public events: Events, private nativeAudio: NativeAudio, public storage: Storage, 
              private ads: Ads, afDB: AngularFireDatabase) {
    this.platform.ready().then(() => {
      //this.itemRef = afDB.object('/user/1', ref => ref.orderByKey().equalTo('1'));
      //console.log(JSON.stringify(this.itemRef));
      //console.log(JSON.stringify(this.itemRef[1]));

      // const size$ = new BehaviorSubject(null);
      // const queryObservable = size$.switchMap(size =>
      //   afDB.list('/user', ref => ref.equalTo(1)).valueChanges()
      // );

     // this.itemsRef = afDB.list('user');
      // Use snapshotChanges().map() to store the key
      // this.items = this.itemsRef.snapshotChanges().map(changes => {
      //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      // });

      this.items = afDB.object('user').valueChanges();
      console.log(JSON.stringify(this.items));

      // let size$ = new BehaviorSubject(null);
      // this.items$ = size$.switchMap(size =>
      //   afDB.list('/user', ref =>
      //     size ? ref.equalTo(1) : ref
      //   ).snapshotChanges()
      // );

      //console.log(JSON.stringify(this.items$));

      //const relative = afDB.object('user/1');
      //console.log(relative.name);

      // let c = 1;    
      // this.a = JSON.stringify(b);
     // console.log(JSON.stringify(this.a));
      
      this.levelNumber = 0;
      this.listenAdChange();
      this.storage.set('isAd', true);

      this.checkRemoveAds();
      this.checkSoundEnabled();
      this.loadSounds();
    });
  }

  listenAdChange() {
    this.events.subscribe('ad_change', (value) => {
      this.isAd = value;
    });
  }

  checkRemoveAds() {
    this.storage.get('isAd').then((val) => {
      console.log('isAd is', val);
      this.isAd = val;
      if (this.isAd) {
        this.ads.showAdmobBannerAdMob();
      }
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

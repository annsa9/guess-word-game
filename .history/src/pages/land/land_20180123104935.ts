import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions, Events } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

import * as _ from "lodash";
import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  public items: Observable<any[]>;
  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;

  public levelNumber: number;
  public isSound: boolean = true;
  public isAd: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
              public events: Events, private nativeAudio: NativeAudio, public storage: Storage, 
    private ads: Ads, db: AngularFirestore) {
    this.platform.ready().then(() => {

      // const size$ = new BehaviorSubject(null);
      // const queryObservable = size$.switchMap(size =>
      //   afDB.list('/user', ref => ref.equalTo(1)).valueChanges()
      // );

     // this.itemsRef = afDB.list('user');
      // Use snapshotChanges().map() to store the key
      // this.items = this.itemsRef.snapshotChanges().map(changes => {
      //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      // });

       this.items = db.collection('users').valueChanges();
      // console.log(this.items);
           

      this.itemDoc = db.doc<any>('users/sB1ubKPvs3oYxEdG5hRa');
      this.item = this.itemDoc.snapshotChanges(); 
      console.log(this.item);
      this.item.subscribe(snapshot => {
        console.log('hello');
        console.log(snapshot.key);
        
      });

      // let size$ = new BehaviorSubject(null);
      // this.items$ = size$.switchMap(size =>
      //   afDB.list('/user', ref =>
      //     size ? ref.equalTo(1) : ref
      //   ).snapshotChanges()
      // );
      
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
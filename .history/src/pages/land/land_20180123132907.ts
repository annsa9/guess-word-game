import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions, Events } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
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
  private userRef: AngularFirestoreCollection<any>;
  docId: Observable<any[]>;

  public levelNumber: number;
  public isSound: boolean = true;
  public isAd: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
              public events: Events, private nativeAudio: NativeAudio, public storage: Storage, 
              private ads: Ads, public db: AngularFirestore, private device: Device) {
    this.platform.ready().then(() => {

      this.items = db.collection('users').valueChanges();

      // this.itemDoc = db.doc<any>('users/sB1ubKPvs3oYxEdG5hRa');
      // this.item = this.itemDoc.valueChanges();
      
      this.setUpDatabase();
      this.listenAdChange();

      this.checkRemoveAds();
      this.checkSoundEnabled();
      this.loadSounds();
    });
  }

  setUpDatabase() {
    this.userRef = this.db.collection('users', ref => ref.where('name', '==', 'b'));

    this.docId = this.userRef.snapshotChanges().map(changes => {
      if (changes.length) {
        return changes.map(a => {
          console.log(a.payload.doc.id);
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      } else {
        const newUser = {
          deviceId: this.device.uuid,
          levelNumber: 0,
          isAd: true
        }
        this.db.collection('users').add(newUser);
        console.log('no');
      }
    });

    this.db.doc(`users/4`)
      .update({ name: 'helloupdate' })
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        // console.log('Error updating user', error); // (document does not exists)
        this.db.doc(`users/4`)
          .set({ name: 'hello1' });
      });

    this.docId.subscribe(docs => {
      if (docs && docs.length) {
        docs.forEach(doc => {
          console.log(JSON.stringify(doc));
        })
      }
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

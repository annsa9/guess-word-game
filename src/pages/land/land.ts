import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ModalOptions, Events } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../home/home';
import { Network } from '@ionic-native/network';

import * as _ from "lodash";
import { SettingPage } from '../setting/setting';
import { Ads } from "../../services/ads";

@Component({
  selector: 'page-land',
  templateUrl: 'land.html'
})
export class LandPage {

  //private itemDoc: AngularFirestoreDocument<any>;
  //item: Observable<any>;
  private userRef: AngularFirestoreCollection<any>;
  docId: Observable<any[]>;

  public documentId: string;
  public levelNumber: number;
  public isSound: boolean;
  public isAd: boolean;
  public userHints: number;
  public isInternet: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
              public events: Events, private nativeAudio: NativeAudio, public storage: Storage, 
              private ads: Ads, public db: AngularFirestore, private device: Device, private network: Network) {
    this.platform.ready().then(() => {

      // this.items = db.collection('users').valueChanges();
      // this.itemDoc = db.doc<any>('users/sB1ubKPvs3oYxEdG5hRa');
      // this.item = this.itemDoc.valueChanges();
      this.listenNetworkChange();
      
      storage.set('isSound', true);
      this.setUpDatabase();

      this.checkSoundEnabled();      
      this.listenAdChange();
    });
  }

  addData() {
    let puzzle = {
      levelNumber: 20,
      answer: 'TRICK',
      images: [
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/fourinoneapp-6284f.appspot.com/o/20%2Fpexels-photo-220426.jpeg?alt=media&token=da74a883-4074-4ad4-826b-1a723fd2b509',
          author: 'pexels.com',
        },
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/fourinoneapp-6284f.appspot.com/o/20%2Fpexels-photo-415188.jpeg?alt=media&token=660842a9-a057-479e-b02a-a8d8980127fe',
          author: 'pexels.com'
        },
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/fourinoneapp-6284f.appspot.com/o/20%2Fpexels-photo-48013.jpeg?alt=media&token=7798b7c3-8b49-4e41-b6ce-1ce0f39594f8',
          author: 'pexels.com'
        },
        {
          imgUrl: 'https://firebasestorage.googleapis.com/v0/b/fourinoneapp-6284f.appspot.com/o/20%2Fpexels-photo-700953.jpeg?alt=media&token=99a4e11c-0f3c-4f2b-8d78-8a805035bab2',
          author: 'pexels.com'
        }
      ]
    }
    this.db.collection('puzzles').add(puzzle);
    alert('here');
  }

  listenNetworkChange() {
    this.network.onConnect().subscribe(() => {
      this.isInternet = true;
    });

    this.network.onDisconnect().subscribe(() => {
      this.isInternet = false;
      alert('Please check your internet connection');
    });
  }

  setUpDatabase() {
    this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', this.device.uuid));
    //web
    //this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', '1'));

    this.docId = this.userRef.snapshotChanges().map(changes => {
      if (changes.length) {
        return changes.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      } else {
        const newUser = {
          deviceId: this.device.uuid,
          levelNumber: 1,
          isAd: true,
          userHints: 20
        }
        this.db.collection('users').add(newUser);
      }
    });

    this.docId.subscribe(docs => {
      if (docs && docs.length) {
        docs.forEach(doc => {
          console.log(JSON.stringify(doc));
          this.documentId = doc.id;
          this.levelNumber = doc.levelNumber;
          this.isAd = doc.isAd;
          this.userHints = doc.userHints;
        })
      }
      this.checkRemoveAds();      
    });
  }

  listenAdChange() {
    this.events.subscribe('ad_change', (value) => {
      this.isAd = value;
      if (!this.isAd) {
        this.ads.removeBannerAd();
      }
      this.db.doc(`users/` + this.documentId)
        .update({ isAd: value })
        .then(() => {
          // update successful (document exists)
        })
        .catch((error) => {
          alert('Could not update at server side');
        });
    });
  }

  checkRemoveAds() {
      let homePageActive = this.navCtrl.last().instance instanceof HomePage;
      if (this.isAd && !homePageActive) {
        this.ads.showAdmobBannerAdMob();
      }
  }

  loadSounds() {
    this.nativeAudio.preloadSimple('game_start', 'assets/sounds/start.wav').then((onSuccess) => {}, (onError) => {});
    this.nativeAudio.preloadSimple('game_theme', 'assets/sounds/8_string_ballad.mp3').then((onSuccess) => {
    if (this.isSound) {
      this.nativeAudio.loop('game_theme').then((onSuccess) => { }, (onError) => { });
    }
    }, (onError) => {});
  }

  checkSoundEnabled() {
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
      this.loadSounds();      
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
      documentId: this.documentId,      
      levelNumber: this.levelNumber,
      userHints: this.userHints,
      isAd: this.isAd
    });
  }

  showSetting() {
    const settingOptions: ModalOptions ={
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    let settingModal = this.modalCtrl.create(SettingPage, {isAd: this.isAd}, settingOptions);
    settingModal.present();
  }

  ionViewDidEnter () {
    console.log('this.isAd', this.isAd);
    if (this.isAd) {
      this.ads.showAdmobBannerAdMob();
    }
    
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
      if (this.isSound) {
        this.nativeAudio.loop('game_theme').then((onSuccess) => { }, (onError) => { });
      }   
    }); 
  }
  
}

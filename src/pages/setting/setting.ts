import { Component } from '@angular/core';
import { NavController, Platform, ViewController, Events, NavParams} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NativeAudio } from '@ionic-native/native-audio';
import { Market } from '@ionic-native/market';
import { SocialSharing } from '@ionic-native/social-sharing';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})

export class SettingPage {
  public credit: boolean;
  public isSound: boolean;
  public isAd: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController,
              private nativeAudio: NativeAudio, public storage: Storage, private market: Market, 
              private socialSharing: SocialSharing, private iap: InAppPurchase, public events: Events,
              params: NavParams) {
    this.platform.ready().then(() => {
      this.isAd = params.get('isAd');
      this.getInAppProducts();
      this.checkSoundEnabled();
    });
  }

  getInAppProducts() {
     this.iap
       .getProducts(["xxxxx"])
       .then((products) => {
         console.log("products", products);
       })
       .catch((err) => {
         console.log(err);
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
    if (!this.isSound) {
      this.nativeAudio.stop('game_theme').then((onSuccess) => { }, (onError) => { });
    } else {
      this.nativeAudio.loop('game_theme').then((onSuccess) => { }, (onError) => { });
    }
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

  rateApp() {
    this.market.open('io.ionic.fourinonegame');
  }

  shareApp() {
    let text = "Hey, I found this amazing brainteaser app! Be sure to check it out. \n";
    let subject = "A perfect fun game";
    let url = "https://play.google.com/store/apps/details?id=io.ionic.fourinonegame";

    this.socialSharing.share(text, subject, '', url).then(() => {
      console.log("suceesfully shared");
    }).catch((e) => {
      console.log("error while sharing" + e);
    });
  }

  removeAds(productId) {
    this.iap
      .buy(productId)
      .then((data) => {
        console.log(JSON.stringify(data));

        switch (productId) {
          case 'remove_ad': {
            this.events.publish('ad_change', false);
            this.isAd = false;
            break;
          }
          default: {
            //statements; 
            break;
          }
        }

        return this.iap.consume(data.productType, data.receipt, data.signature);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });    
  }
}
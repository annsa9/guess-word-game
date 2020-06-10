import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ViewController } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html'
})

export class HintPage {

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController,
              private iap: InAppPurchase) {
    this.platform.ready().then(() => {
      
    });
  }

  getInAppProducts() {
    this.iap
      .getProducts(['prod1', 'prod2', ...])
      .then((products) => {
        console.log(products);
        //  [{ productId: 'com.yourapp.prod1', 'title': '...', description: '...', price: '...' }, ...]
      })
      .catch((err) => {
        console.log(err);
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

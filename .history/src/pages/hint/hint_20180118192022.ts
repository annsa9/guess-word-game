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
      this.getInAppProducts();
    });
  }

  getInAppProducts() {
    this.iap
      .getProducts(['io.ionic.fourinoneapp.remove_ad', 'io.ionic.fourinoneapp.10_hints'])
      .then((products) => {
        console.log("products", products);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  purchaseInApp(productId) {
    this.iap
      .buy(productId)
      .then((data) => {
        alert(data);
        alert(JSON.stringify(data));
        // {
        //   transactionId: ...
        //   receipt: ...
        //   signature: ...
        // }
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

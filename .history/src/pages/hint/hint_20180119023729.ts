import { Component } from '@angular/core';
import { NavController, Platform, ModalController, ViewController, Events } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html'
})

export class HintPage {

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController,
              private iap: InAppPurchase, public events: Events) {
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
        alert(JSON.stringify(data));

        switch (productId) {
          case '10_hints': {
            this.events.publish('hints_change', 10);
            break;
          }
          case '20_hints': {
            this.events.publish('hints_change', 20);
            break;
          }
          case '60_hints': {
            this.events.publish('hints_change', 60);
            break;
          }
          case '100_hints': {
            this.events.publish('hints_change', 100);
            break;
          }
          case 'remove_ad': {
            this.events.publish('ad_change', false);
            break;
          }
          default: {
            //statements; 
            break;
          }
        }

        // consuming is necessary to purchase again
        if (productId != 'remove_ad') {
          return this.iap.consume(data.productType, data.receipt, data.signature);
        }

      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

import { Component } from '@angular/core';
import { NavController, Platform, ViewController, Events, NavParams } from 'ionic-angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase';

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html'
})

export class HintPage {
  public isAd: boolean;

  constructor(public navCtrl: NavController, public platform: Platform, private viewCtrl: ViewController,
              private iap: InAppPurchase, public events: Events, params: NavParams) {
    this.platform.ready().then(() => {
      this.isAd = params.get('isAd');
      this.getInAppProducts();
    });
  }

  getInAppProducts() {
    this.iap
      .getProducts(["xxxxx", "xxxxx"])
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
        console.log(JSON.stringify(data));

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

  dismiss() {
    this.viewCtrl.dismiss();
  }

}

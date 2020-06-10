import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Market } from '@ionic-native/market';

import { HomePage } from '../pages/home/home';
import { LandPage } from '../pages/land/land';
import { Ads } from "../services/ads";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LandPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private device: Device,
    private market: Market, private ads: Ads) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#4183D7');
      splashScreen.hide();
      this.initApp();
    });
  }

  initApp() {
    console.log('Device UUID is: ' + this.device.uuid);

    // Advertisement network events
    this.ads.registerAdEvents();
  }
}


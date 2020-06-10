import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Market } from '@ionic-native/market';
import { HeaderColor } from '@ionic-native/header-color';

import { HomePage } from '../pages/home/home';
import { LandPage } from '../pages/land/land';
import { Ads } from "../services/ads";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = LandPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private device: Device,
    private market: Market, private ads: Ads, private headerColor: HeaderColor) {
    platform.ready().then(() => {
      // Changing android status bar colour
      statusBar.backgroundColorByHexString('#F22613');
      // Changing header colour after multitask view
      this.headerColor.tint('#F3410E');

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


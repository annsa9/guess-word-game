import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AdMobFree } from '@ionic-native/admob-free';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Market } from '@ionic-native/market';
import { HeaderColor } from '@ionic-native/header-color';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FCM } from '@ionic-native/fcm';

import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandPage } from '../pages/land/land';
import { LevelsPage } from '../pages/levels/levels';
import { SettingPage } from '../pages/setting/setting';
import { HintPage } from '../pages/hint/hint';
import { Database } from "../services/database";
import { Ads } from "../services/ads";

export const firebaseConfig = {
  apiKey: "AIzaSyC5uJ-6uKOtwzM5O5nnL0ToZPAYu_sZVEI",
  authDomain: "fourinoneapp-6284f.firebaseapp.com",
  databaseURL: "https://fourinoneapp-6284f.firebaseio.com/",
  storageBucket: "fourinoneapp-6284f.appspot.com",
  messagingSenderId: '77506874176'
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LandPage,
    LevelsPage,
    SettingPage,
    HintPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LandPage,
    LevelsPage,
    SettingPage,
    HintPage
  ],
  providers: [
    Database,
    Ads,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdMobFree,
    PhotoViewer,
    NativeAudio,
    Device,
    InAppPurchase,
    Market,
    HeaderColor,
    SocialSharing,
    AngularFireDatabase,
    FCM
  ]
})
export class AppModule {}

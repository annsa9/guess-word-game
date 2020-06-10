import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AdMobFree } from '@ionic-native/admob-free';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NativeAudio } from '@ionic-native/native-audio';
import { Device } from '@ionic-native/device';
import { InAppPurchase } from '@ionic-native/in-app-purchase';
import { Market } from '@ionic-native/market';
import { HeaderColor } from '@ionic-native/header-color';

import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandPage } from '../pages/land/land';
import { LevelsPage } from '../pages/levels/levels';
import { SettingPage } from '../pages/setting/setting';
import { HintPage } from '../pages/hint/hint';
import { Database } from "../services/database";
import { Ads } from "../services/ads";

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
    IonicStorageModule.forRoot()
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
    SQLite,
    SQLitePorter,
    PhotoViewer,
    NativeAudio,
    Device,
    InAppPurchase,
    Market,
    HeaderColor
  ]
})
export class AppModule {}

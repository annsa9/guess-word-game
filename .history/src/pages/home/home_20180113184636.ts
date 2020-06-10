import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public letters: string[] = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t',
                             'u','v','w','x','y','z'];

  constructor(public navCtrl: NavController) {
    console.log(_);
  }

}

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import * as _ from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public letters: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T',
                            'U','V','W','X','Y','Z'];
  public answer: string = 'THINK'; 
  public answerArray: string[];
  public answerShuffle: string[];                           


  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
      console.log('lodash', _.VERSION);
      this.answerArray = this.answer.split('');
      console.log('answerArray', this.answerArray);

      this.answerShuffle = this.shuffleArray(this.answerArray);
      console.log('answerShuffle', this.answerArray,'-', this.answerShuffle);
    });
  }

  shuffleArray(array): string[] {
    var copy = [], n = array.length, i;
    // While there remain elements to shuffle…
    while (n) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * n--);

      // And move it to the new array.
      copy.push(array.splice(i, 1)[0]);
    }

    return copy;
  }

}

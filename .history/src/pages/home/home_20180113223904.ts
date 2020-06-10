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
  public randomLettersRemaining: string[];
  public randomLettersLength: number = 10;   
  public finalRandomLetters: string[];                       


  constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform.ready().then(() => {
      console.log('lodash', _.VERSION);
      this.answerArray = this.answer.split('');
      console.log('answerArray', this.answerArray);

      // Deep copy
      this.randomLettersRemaining = this.letters.slice(0);
      // Shuffle
      this.randomLettersRemaining = _.difference(this.letters, this.answerArray);
      console.log('randomLetterRemaining diff', this.randomLettersRemaining);
      this.randomLettersRemaining = this.pickRandomElements(this.randomLettersRemaining, this.randomLettersLength-this.answerArray.length);
      console.log('randomLetterRemaining', this.letters, '-', this.randomLettersRemaining);

      this.finalRandomLetters = this.answerArray.concat(this.randomLettersRemaining);
      this.finalRandomLetters = this.shuffleArray(this.finalRandomLetters);
      console.log('finalRandomLetters', this.finalRandomLetters);
    });
  }

  shuffleArray(array): string[] {
    for (var i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  pickRandomElements(array, length): string[] {
    return Array.apply(null, Array(length)).map(function () {
      return array[Math.floor(Math.random() * array.length)];
    });
  }

}

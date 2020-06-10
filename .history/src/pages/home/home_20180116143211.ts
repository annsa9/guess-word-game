import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ModalController, ModalOptions } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { HintPage } from '../hint/hint';
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
  public randomLettersRemaining: string[];
  public randomLettersLength: number = 10;   
  public finalRandomLetters: string[];                       
  public userSelected: string[];
  public hintCollection: string[];
  public isAnswerCorrect: boolean;
  public lastCharacter: boolean;
  public showResult: boolean;
  public hintActive: any;
  public isHintText: boolean;
  public levelNumber: number;

  constructor(public navCtrl: NavController, public platform: Platform, private navParams: NavParams,
    public modalCtrl: ModalController, private photoViewer: PhotoViewer) {
    this.platform.ready().then(() => {
      console.log('lodash', _.VERSION);
      this.levelNumber = navParams.get('levelNumber');
      this.setupPuzzle();
    });
  }

  setupPuzzle() {
    this.answerArray = this.answer.split('');
    console.log('answerArray', this.answerArray);
    //hint active object
    this.hintActive = {};
    for (let i = 0; i < this.answerArray.length; i++) {
      this.hintActive[i] = false;
    }
    console.log(JSON.stringify(this.hintActive));

    this.userSelected = Array.apply(null, Array(this.answerArray.length));
    this.hintCollection = Array.apply(null, Array(this.answerArray.length)).map((u, i) => i);
    console.log('hintCollection', this.hintCollection);

    // Deep copy
    this.randomLettersRemaining = this.letters.slice(0);

    this.randomLettersRemaining = _.difference(this.letters, this.answerArray);
    console.log('randomLetterRemaining diff', this.randomLettersRemaining);
    this.randomLettersRemaining = this.pickRandomElements(this.randomLettersRemaining, this.randomLettersLength - this.answerArray.length);
    console.log('randomLetterRemaining', this.randomLettersRemaining);

    this.finalRandomLetters = this.shuffleArray(this.answerArray.concat(this.randomLettersRemaining));
    console.log('finalRandomLetters', this.finalRandomLetters);
  }

  shuffleArray(array): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
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

  checkAnswer(userSelected): boolean {
    let userSelectedWorld = userSelected.join('');
    if (this.answer == userSelectedWorld) {
      return true;
    } else {
      return false;
    }
  }

  shuffleTap(letter, index) {
    if (letter != null && !this.lastCharacter) {
      this.lastCharacter = false;
      console.log(letter, index);
      this.finalRandomLetters[index] = null;

      for (let i = 0; i < this.userSelected.length; i++) {
        if (this.userSelected[i] == null) {
          this.userSelected[i] = letter;
          break;
        }
      }

      for (let i = 0, count=0; i < this.userSelected.length; i++) {
        if (this.userSelected[i] != null) {
          count++;
          if (count == this.userSelected.length) {
            console.log('last character');
            this.lastCharacter = true;
            this.isAnswerCorrect = this.checkAnswer(this.userSelected);
            this.showResult = true;
            setTimeout(()=>{
              this.showResult = false;
            }, 1000);
            console.log('this.isAnswerCorrect', this.isAnswerCorrect);
          }
        }
      }
    }
  }

  shuffleAnswerTap(letter, index) {
    if (letter != null) {
      this.lastCharacter = false;
      console.log(letter, index);
      this.userSelected[index] = null;
      this.hintActive[index] = false;

      for (let i = 0; i < this.finalRandomLetters.length; i++) {
        if (this.finalRandomLetters[i] == null) {
          this.finalRandomLetters[i] = letter;
          break;
        }
      }
    }
  }

  nextQuestion() {
    this.resetPuzzle();
    this.answer = "SPORT";    
    this.setupPuzzle();    
  }

  resetPuzzle() {
    this.answerArray = [];
    this.randomLettersRemaining = [];
    this.finalRandomLetters = [];
    this.userSelected = [];
    this.hintCollection = [];
    this.isAnswerCorrect = false;
    this.lastCharacter = false;
    this.showResult = false;
    this.hintActive = {};
  }

  showHint() {
    let randomNum = _.sample(this.hintCollection);
    console.log(this.hintCollection, "-",randomNum);

    // show hint text
    this.isHintText = true;
    setTimeout(()=>{
      this.isHintText = false;
    }, 1000);    

    // If random number place already taken by another letter, move it to shuffle array
    if (this.userSelected[randomNum] != null) {
      for (let i = 0; i < this.finalRandomLetters.length; i++) {
        if (this.finalRandomLetters[i] == null) {
          this.finalRandomLetters[i] = this.userSelected[randomNum];
          break;
        }
      }
    }

    this.userSelected[randomNum] = this.answerArray[randomNum];
    this.hintActive[randomNum] = true;
    console.log("this.hintActive[randomNum]", this.hintActive[randomNum]);
    this.hintCollection.splice(this.hintCollection.indexOf(randomNum), 1);

    // Taking out concerened letter from shuffle array
    for (let i = 0; i < this.finalRandomLetters.length; i++) {
      if (this.finalRandomLetters[i] == this.userSelected[randomNum]) {
        this.finalRandomLetters[i] = null;
        break;
      }
    }

    // Checking if user selected is full
    for (let i = 0, count = 0; i < this.userSelected.length; i++) {
      if (this.userSelected[i] != null) {
        count++;
        if (count == this.userSelected.length) {
          console.log('last character');
          this.lastCharacter = true;
          setTimeout(() => {
            this.isAnswerCorrect = this.checkAnswer(this.userSelected);
            console.log('this.isAnswerCorrect', this.isAnswerCorrect);
          }, 500);
        }
      } else {
        break;
      }
    }
  }

  checkInHints(i): boolean {
    let result = _.includes(this.hintCollection, i);
    console.log("result", result);
    return result;
  }

  goToLand() {
    this.navCtrl.pop();
  }

  showHintModal() {
    const hintOptions: ModalOptions = {
      showBackdrop: true,
      enableBackdropDismiss: true
    };
    let hintModal = this.modalCtrl.create(HintPage, {}, hintOptions);
    hintModal.present();
  }

  showFullImage(imageUrl) {
    this.photoViewer.show(imageUrl, 'My image title', { share: false });
  }

}

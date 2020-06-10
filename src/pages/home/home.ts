import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ModalController, ModalOptions, Events, Loading, LoadingController } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { NativeAudio } from '@ionic-native/native-audio';
import { Storage } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

import { HintPage } from '../hint/hint';
import { Ads } from "../../services/ads";
import * as _ from "lodash";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public letters: string[] = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T',
                            'U','V','W','X','Y','Z'];
  
  public answer: string;
  public userHints: number;
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
  public userSelectedAll: boolean;
  public wrongCount: number = 0;
  public isSound: boolean = true;  
  public isAd: boolean;
  public userDocumentId: string;
  public images: any[] = [];
  public oldAnswer: string;
  private loading: Loading;
  private isInternet: boolean;
  private previousLetters: any;

  private puzzleRef: AngularFirestoreCollection<any>;
  private userRef: AngularFirestoreCollection<any>;
  private docId: Observable<any[]>;
  public PuzzleDocumentId: string;

  constructor(public navCtrl: NavController, public platform: Platform, private navParams: NavParams,
    public modalCtrl: ModalController, private photoViewer: PhotoViewer, public nativeAudio: NativeAudio,
    private storage: Storage, private ads: Ads, public events: Events, private socialSharing: SocialSharing, private loadingCtrl: LoadingController, private device: Device,
    public db: AngularFirestore, private network: Network) {
    this.platform.ready().then(() => {
      console.log('lodash', _.VERSION);
      this.listenNetworkChange();
      this.loadingSetup();
      this.userDocumentId = navParams.get('documentId');
      this.levelNumber = navParams.get('levelNumber');
      this.userHints = navParams.get('userHints');
      this.isAd = navParams.get('isAd');

      //web
      //alert(this.levelNumber);
      if (!this.levelNumber) {
        this.setUpDatabaseUser();
      } else {
        this.setUser();
      }

      this.ads.removeBannerAd();
      this.listenHintChange();
      this.listenAdChange();

      this.checkSoundEnabled();
      this.loadSounds();
    });
  }

  loadingSetup() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  }

  setUpDatabaseUser() {
    this.loading.present();
    this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', this.device.uuid));
    //web
    //this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', '1'));

    this.docId = this.userRef.snapshotChanges().map(changes => {
      if (changes.length) {
        return changes.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      } else {
        const newUser = {
          deviceId: this.device.uuid,
          levelNumber: 1,
          isAd: true,
          userHints: 20
        }
        this.db.collection('users').add(newUser);
      }
    });

    this.docId.subscribe(docs => {
      if (docs && docs.length) {
        docs.forEach(doc => {
          console.log(JSON.stringify(doc));
          this.userDocumentId = doc.id;
          this.levelNumber = doc.levelNumber;
          this.isAd = doc.isAd;
          this.userHints = doc.userHints;
          this.previousLetters = doc.alreadyLetters;
        })
      } 
    });
    setTimeout(()=> {
      if (this.levelNumber) {
        this.loading.dismiss();
        this.setUpDatabase(this.levelNumber, false);
      }
    }, 2000);
  }

  setUser() {
    this.loading.present();
    this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', this.device.uuid));
    //web
    //this.userRef = this.db.collection('users', ref => ref.where('deviceId', '==', '1'));

    this.docId = this.userRef.snapshotChanges().map(changes => {
      if (changes.length) {
        return changes.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      }
    });

    this.docId.subscribe(docs => {
      if (docs && docs.length) {
        docs.forEach(doc => {
          console.log(JSON.stringify(doc));
          this.userDocumentId = doc.id;
          this.levelNumber = doc.levelNumber;
          this.isAd = doc.isAd;
          this.userHints = doc.userHints;
          this.previousLetters = doc.alreadyLetters;
        })
      } 
    });
    setTimeout(()=> {
      if (this.levelNumber) {
        this.loading.dismiss();
        this.setUpDatabase(this.levelNumber, false);
      }
    }, 1000);
  }

  listenNetworkChange() {
    this.network.onConnect().subscribe(() => {
      this.isInternet = true;
    });

    this.network.onDisconnect().subscribe(() => {
      this.isInternet = false;
    });
  }
  
  listenHintChange() {
    this.events.subscribe('hints_change', (value) => {
      if (value) {
        this.userHints = this.userHints + value;
        console.log('this.userHints', this.userHints);
        this.db.doc(`users/` + this.userDocumentId)
          .update({ userHints: this.userHints })
          .then(() => {
            // update successful (document exists)
          })
          .catch((error) => {
            alert('Could not update at server side');
          });
      }
    });
  }

  listenAdChange() {
    this.events.subscribe('ad_change', (value) => {
      this.isAd = value;
      if (!this.isAd) {
        this.ads.removeBannerAd();
      }
      this.db.doc(`users/` + this.userDocumentId)
        .update({ isAd: value })
        .then(() => {
          // update successful (document exists)
        })
        .catch((error) => {
          alert('Could not update at server side');
        });
    });
  }

  checkSoundEnabled() {
    this.storage.get('isSound').then((val) => {
      console.log('Sound is', val);
      this.isSound = val;
    });
  }

  loadSounds() {
    this.nativeAudio.preloadSimple('game_start', 'assets/sounds/start.wav').then((onSuccess) => { }, (onError) => { });
    this.nativeAudio.preloadSimple('letter_in', 'assets/sounds/letter_in.mp3').then((onSuccess) => {}, (onError) => {});
    this.nativeAudio.preloadSimple('letter_out', 'assets/sounds/letter_out.mp3').then((onSuccess) => { }, (onError) => { });
    this.nativeAudio.preloadSimple('hint', 'assets/sounds/hint.wav').then((onSuccess) => { }, (onError) => { });
    this.nativeAudio.preloadSimple('wrong', 'assets/sounds/wrong.wav').then((onSuccess) => {}, (onError) => {});
    this.nativeAudio.preloadSimple('correct', 'assets/sounds/correct.wav').then((onSuccess) => { }, (onError) => { });
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

    if(this.previousLetters && this.previousLetters.levelNumber && this.previousLetters.levelNumber == this.levelNumber) {
      this.finalRandomLetters = this.previousLetters.finalRandomLetters;
    } else {
      // Deep copy
      this.randomLettersRemaining = this.letters.slice(0);

      this.randomLettersRemaining = _.difference(this.letters, this.answerArray);
      console.log('randomLetterRemaining diff', this.randomLettersRemaining);
      this.randomLettersRemaining = this.pickRandomElements(this.randomLettersRemaining, this.randomLettersLength - this.answerArray.length);
      console.log('randomLetterRemaining', this.randomLettersRemaining);

      this.finalRandomLetters = this.shuffleArray(this.answerArray.concat(this.randomLettersRemaining));
      console.log('finalRandomLetters', this.finalRandomLetters);

      let alreadyLetters = {
        levelNumber: this.levelNumber,
        finalRandomLetters: this.finalRandomLetters
      }
      this.db.doc(`users/` + this.userDocumentId)
        .update({ alreadyLetters: alreadyLetters })
        .then(() => {
          // update successful (document exists)
        })
        .catch((error) => {
          alert('Could not update at server side');
      });
    }
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
      this.resetPuzzle(); 
      this.setUpDatabase(this.levelNumber+1, true);
      return true;
    } else {
      return false;
    }
  }

  nextQuestion() {
    if (this.isAd) {
      this.ads.showInterstitialAdMob();
    }
    if (this.isSound) {
      this.nativeAudio.play('game_start').then((onSuccess) => { }, (onError) => { });
    }
    this.ads.removeBannerAd();
    this.isAnswerCorrect = false;
  }

  setUpDatabase(levelNumber, nextLevel) {
    this.oldAnswer = this.answer;
    this.puzzleRef = this.db.collection('puzzles', ref => ref.where('levelNumber', '==', levelNumber));

    this.docId = this.puzzleRef.snapshotChanges().map(changes => {
      if (changes.length) {
        if (nextLevel) {
          this.levelNumber = this.levelNumber+1;
          this.userHints = this.userHints+1;

          this.db.doc(`users/` + this.userDocumentId)
            .update({ levelNumber: this.levelNumber })
            .then(() => {
              // update successful (document exists)
            })
            .catch((error) => {
              alert('Could not update at server side');
            });

          this.db.doc(`users/` + this.userDocumentId)
            .update({ userHints: this.userHints })
            .then(() => {
              // update successful (document exists)
            })
            .catch((error) => {
              alert('Could not update at server side');
            });
        }

        return changes.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      } else {
        alert('Congrats! More levels coming soon. Keep checking! :)');
      }
    });

    this.docId.subscribe(docs => {
      if (docs && docs.length) {
        docs.forEach(doc => {
          console.log(JSON.stringify(doc));
          this.PuzzleDocumentId = doc.id;
          this.answer = doc.answer;
          this.images = doc.images;
        })
      }
      this.setupPuzzle();      
    });
  }

  shuffleTap(letter, index) {

    if (this.isSound && !this.userSelectedAll && letter != null) {
      this.nativeAudio.play('letter_in').then((onSuccess) => { }, (onError) => { });
    }

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
            this.userSelectedAll = true;
            this.lastCharacter = true;
            this.isAnswerCorrect = this.checkAnswer(this.userSelected);

            if (this.isAnswerCorrect && this.isAd) {
              this.ads.showAdmobBannerAdMob();
            } else {
              this.wrongCount++;
              if (this.wrongCount%5 == 0 && this.isAd) {
                this.ads.showInterstitialAdMob();
              }
            }

            if (this.isSound && !this.isAnswerCorrect) {
              this.nativeAudio.play('wrong').then((onSuccess) => { }, (onError) => { });
            }
            if (this.isSound && this.isAnswerCorrect) {
              this.nativeAudio.play('correct').then((onSuccess) => { }, (onError) => { });
            }

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
      if (this.isSound) {
        this.nativeAudio.play('letter_out').then((onSuccess) => { }, (onError) => { });
      }

      this.userSelectedAll = false;
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

  resetPuzzle() {
    this.answerArray = [];
    this.randomLettersRemaining = [];
    this.finalRandomLetters = [];
    this.userSelected = [];
    this.hintCollection = [];
    this.lastCharacter = false;
    this.showResult = false;
    this.hintActive = {};
    this.userSelectedAll = false;
    this.wrongCount = 0;
  }

  showHint() {
    if(this.userHints == 0) {
      this.showHintModal();
      return;
    }

    this.userHints--;

    this.db.doc(`users/` + this.userDocumentId)
      .update({ userHints: this.userHints })
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        alert('Could not update at server side');
      });

    if (this.isSound) {
      this.nativeAudio.play('hint').then((onSuccess) => { }, (onError) => { });
    }

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
          this.isAnswerCorrect = this.checkAnswer(this.userSelected);

          if (this.isAnswerCorrect && this.isAd) {
            this.ads.showAdmobBannerAdMob();
          }

          if (this.isSound && this.isAnswerCorrect) {
            this.nativeAudio.play('correct').then((onSuccess) => { }, (onError) => { });
          }
          console.log('this.isAnswerCorrect', this.isAnswerCorrect);
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
    let hintModal = this.modalCtrl.create(HintPage, {isAd: this.isAd}, hintOptions);
    hintModal.present();
  }

  showFullImage(image) {
    let title = '@'+image.author;
    if (image.authorLink) {
      title = title+' - '+image.authorLink;
    }
    this.photoViewer.show(image.imgUrl, title, { share: false });
  }

  sharePuzzle() {
    let message = "Hi, I'm stuck at level "+this.levelNumber+". Can you help me? \n";
    let url = "https://play.google.com/store/apps/details?id=io.ionic.fourinonegame";

    // Share via spread sheet
    this.socialSharing.share(message, 'Help me in the puzzle game', '', url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

}

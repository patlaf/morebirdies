import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/do';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the UserProfileFullPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile-full',
  templateUrl: 'user-profile-full.html',
})
export class UserProfileFullPage {

  user: any;
  userID: string;
  imageSrc: string;
  username: string;

  constructor(private afAuth: AngularFireAuth, private afdb : AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams
              ,private toastCtrl: ToastController) {
    this.imageSrc = "assets/imgs/profile.png";



    if(localStorage.getItem("IsUserLoggedIn") != undefined){
      this.userID = localStorage.getItem("IsUserLoggedIn");
    }
    else {
      this.afAuth.authState.subscribe(data => {
        this.userID = data.uid
      });
    }

    // Load the user object with firebase data
    this.user = {};
    this.afdb.object(`users/${this.userID}`).snapshotChanges().subscribe(u2 => { this.user = u2.payload.val();})

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfileFullPage');
  }


  updateProfile() {

      let error = false;
      //username
      if(!this.user.username || this.user.username == '' || this.user.username === undefined) this.user.username = this.user.email;
    

      // email

      // birth Date

      // handicap should be between 0 and 41 @todo
      if((this.user.handicap < 0 || this.user.handicap > 41)) {
        error = true;
        this.toastCtrl.create({
          message: 'Your handicap is a bit off. Please make sure it is valid !',
          showCloseButton: true,
          duration: 4000,
          position: 'bottom',
          cssClass: "toastErrorMessage",
        }).present();
      }

      // membership

      // gender

      if(!error) {
        this.afdb.object(`users/${this.userID}`).set(this.user)
          .then(() => this.navCtrl.setRoot('HomePage'));
      }
  }


  /********************************************
    Navigate to homepage
  *********************************************/
   gotoHome() {
     this.navCtrl.setRoot('HomePage');
   }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase } from 'angularfire2/database';

/**
 * Generated class for the LoginChoicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-choice',
  templateUrl: 'login-choice.html',
})
export class LoginChoicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,  public facebook: Facebook,private afauth: AngularFireAuth,private afdb : AngularFireDatabase) {
    if(localStorage.getItem("IsUserLoggedIn") !=null){
	     	this.navCtrl.setRoot('HomePage');
	  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginChoicePage');
  }

  fbLogin() {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

      this.afauth.auth.signInWithCredential(facebookCredential)
        .then( success => {
          console.log("Firebase success: " + JSON.stringify(success));
          localStorage.setItem("IsUserLoggedIn", success.uid);

          // Keeping the call here rewrite the object user/uid at every login which is actually a good thing
          this.afdb.object(`users/${success.uid}`).set({
            "email": success.email,
            "username": success.displayName,
            "handicap": "",
            "membership": ""
            // ,photo: success.photoURL    success.photoURL has the picture of the FP profile.
          }).then(() => {this.navCtrl.setRoot('HomePage')});
        });

    }).catch((error) => { console.log(error) });


/*
    if (this.platform.is('cordova')) {
      return this.facebook.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  */
}

}

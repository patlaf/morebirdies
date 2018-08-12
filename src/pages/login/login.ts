import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  constructor(private afauth: AngularFireAuth,
      public navCtrl: NavController, public navParams: NavParams,private afdb : AngularFireDatabase,private toastCtrl: ToastController) {
  }

  async login(user: User) {
      try {
          const result = this.afauth.auth.signInWithEmailAndPassword(user.email, user.password).then(user => {
            localStorage.setItem("IsUserLoggedIn", user.uid);
            this.navCtrl.setRoot('HomePage');
          }).catch(e => {

            if(e.code == 'auth/argument-error') e.message = 'The values entered are invalid.';

            this.toastCtrl.create({
                message: e.message,
                showCloseButton: true,
                duration: 4000,
                position: 'bottom',
                cssClass: "toastErrorMessage",
              }).present();});

      }
      catch(e){
          console.error(e);

          if(e.code == 'auth/argument-error') e.message = 'The values entered are invalid.';

          this.toastCtrl.create({
              message: e.message,
              showCloseButton: true,
              duration: 4000,
              position: 'bottom',
              cssClass: "toastErrorMessage",
            }).present();
  }
}


  async register(user: User) {
      try {
          //call firebase auth and add user
          const result = await this.afauth.auth.createUserWithEmailAndPassword(user.email, user.password);

          // add other information to database
          if(result) {
              localStorage.setItem("IsUserLoggedIn", result.uid);
              this.navCtrl.setRoot('UserProfileLightPage', {'user': user});
          }
      }
      catch(e) {
          console.log(e);

          if(e.code == 'auth/argument-error') e.message = 'The values entered are invalid.';

          this.toastCtrl.create({
              message: e.message,
              showCloseButton: true,
              duration: 4000,
              position: 'bottom',
              cssClass: "toastErrorMessage",
            }).present();


      }

  }


}

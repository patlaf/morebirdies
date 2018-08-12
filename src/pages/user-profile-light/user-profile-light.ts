import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable} from 'rxjs/Observable';
/**
 * Generated class for the UserProfileLightPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile-light',
  templateUrl: 'user-profile-light.html',
})
export class UserProfileLightPage {

  user : User;
  //user : Observable<any>;

  constructor(private afauth: AngularFireAuth, private afdb : AngularFireDatabase,
       public navCtrl: NavController, public navParams: NavParams) {

       if(this.navParams.get('user') != ""){
          this.user = this.navParams.get('user');
          console.log(this.user);
          this.user.birthdate = new Date('1990-01-01').toISOString();
       }




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfileLightPage');
  }

  createProfile() {

    // @todo validation des champs
      console.log(this.user);
      if(!this.user.username || this.user.username == '') this.user.username = this.user.email;

      this.afauth.authState.take(1).subscribe(auth => {
          // this.user.email = auth.email;
          this.afdb.object(`users/${auth.uid}`).set(this.user)
            .then(() => this.navCtrl.setRoot('HomePage'));
      })
  }

  skip() {

      // Tiny hack here, event if we skip, the profile has to be saved in the DB with the minimum information provided which is email and password.
      // the username become the email
      this.createProfile();
  }

}

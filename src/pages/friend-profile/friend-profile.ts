import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { GameListService } from '../../services/GameListService';
import { Observable} from 'rxjs/Observable'

/**
 * Generated class for the FriendProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friend-profile',
  templateUrl: 'friend-profile.html',
})
export class FriendProfilePage {
  user: any;
  userID: string;
  friendID: string;
  imageSrc: string;
  username: string;
  gameList$ : Observable<any>;

  constructor(private afAuth: AngularFireAuth, private afdb : AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams,private gameList : GameListService) {
    this.imageSrc = "assets/imgs/profile.png";

    if(this.navParams.get('friend_id') == ""){
      // @todo error occured
    }
    else {
      this.friendID = this.navParams.get('friend_id');
    }


    if(localStorage.getItem("IsUserLoggedIn") != undefined){
      this.userID = localStorage.getItem("IsUserLoggedIn");
    }
    else {
      this.afAuth.authState.subscribe(data => {
        this.userID = data.uid
      });
    }

    this.user = {};
    this.afdb.object(`users/${this.friendID}`).snapshotChanges().subscribe(u2 => { this.user = u2.payload.val();})


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
    this.gameList$ = this.gameList.getGameList(this.friendID, 'date')
      .snapshotChanges().map(games => {
          return games.map(game => ({key: game.payload.key, ... game.payload.val()})
      )});
  }

  /*******************************************************
    Hack to iterate nested birdie list
  ********************************************************/
 getKeys(o){
      if(o) {
          //console.log(Object.keys(o));
          return Object.keys(o);
      }
  }

  /*******************************************************
    Expand / collapse the birdies details
  ********************************************************/
  toggleBirdieDetail(item) {
        item.isCollapse = !item.isCollapse;
    }

}

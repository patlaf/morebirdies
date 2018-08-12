import { Component } from '@angular/core';
import { IonicPage, NavController, FabContainer } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable} from 'rxjs/Observable';
import { GameListService } from '../../services/GameListService';
import { FriendRequestService } from '../../services/FriendRequestService';
import { Game } from '../../models/games';
import 'rxjs/add/operator/take';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab: string = 'Me';
  fabRed: Boolean = true;
  gameList$ : Observable<any[]>;
  friendRequestList$ : Observable<any>;
  friendList$ : Observable<any>;
  user : string;

  constructor(private afAuth : AngularFireAuth, public navCtrl: NavController, private gameList : GameListService, private frs : FriendRequestService,private afdb : AngularFireDatabase,) {

    if(localStorage.getItem("IsUserLoggedIn") != undefined){
      this.user = localStorage.getItem("IsUserLoggedIn");
    }
    else {
      this.afAuth.authState.subscribe(data => {
        this.user = data.uid
      });
    }
    this.tab = 'Me';
    console.log(`Current User Id: ${this.user}`);
  }



  ionViewWillLoad() {
      // Load the game list
      this.gameList$ = this.gameList.getGameList(this.user, 'date')
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
    When tab is changed, update the tabs
  ********************************************************/
  changeTab(tab) {
      this.tab = tab;

      if(tab == 'Friends') {
        this.getFriendRequestList();
        this.getFriendList();
      }
  }


  /*******************************************************
    Expand / collapse the birdies details
  ********************************************************/
  toggleBirdieDetail(item) {
        item.isCollapse = !item.isCollapse;
    }

  /*******************************************************
    Open / Close the Big Red button
  ********************************************************/
  toggleFab() {
        this.fabRed = !this.fabRed;
    }


  /*******************************************************
    Navigate on Add Game page
  ********************************************************/
  button_AddGame(fab ? : FabContainer) {
    if (fab !== undefined) {
      fab.close();
    }
    this.fabRed = true;
    this.navCtrl.push('AddGamePage', {
        "EditGame": ""
    });

  }


  button_AddFriend(fab ? : FabContainer) {
    if (fab !== undefined) {
      fab.close();
    }
    this.fabRed = true;
    this.navCtrl.push('AddFriendPage');

  }


  goto_userprofile() {
    this.navCtrl.push('UserProfileFullPage');
  }

  /*******************************************************
    Navigate on Add Game page in Edit Mode
  ********************************************************/
  goto_editGame(game) {

    this.navCtrl.push('AddGamePage', {
        "EditGame": game
    });
  }


  /*******************************************************
    Delete a game
  ********************************************************/
  deleteGame(game) {

    // @todo add validation: instead of a popup for confirmation, delete it right away but offer an UNDO button
    // maybe the undo should be in a "toast" banner

    this.gameList.deleteGame(this.user, game.key);
  }

  /*******************************************************
    get the friend requests
  ********************************************************/
  getFriendRequestList() {
    this.friendRequestList$ = this.frs.getFriendRequest(this.user)
    .snapshotChanges().map(frequest => {
        return frequest.map(f => ({key: f.payload.key, ... f.payload.val()})
    )}
  );
  }

  /*******************************************************
    get the friend
  ********************************************************/
  getFriendList() {
    this.friendList$ = this.frs.getFriends(this.user)
    .snapshotChanges().map(frequest => {
        return frequest.map(f => ({key: f.payload.key, ... f.payload.val()})
    )}
  );
  }

  /*******************************************************
    refuse friend requests
  ********************************************************/
  refuseFriendRequest(f) {

    this.frs.deleteFriend(f.friend_id,this.user);
    this.frs.cancelFriendRequest(this.user,f.friend_id);
  }

  /*******************************************************
    accept friend requests
  ********************************************************/
  acceptFriendRequest(f) {

    this.frs.deleteFriend(f.friend_id,this.user);
    this.frs.cancelFriendRequest(this.user,f.friend_id);


    this.afdb.object(`users/${f.friend_id}`).snapshotChanges().subscribe(u => {
      console.log(u);
      this.frs.addFriend(this.user,{
         "friend_id": f.friend_id,
         "friend_username": u.payload.val().username,
         "IsAccepted": true
       });
    });

    this.afdb.object(`users/${this.user}`).snapshotChanges().subscribe(u => {
      this.frs.addFriend(f.friend_id,{
        "friend_id": this.user,
        "friend_username": u.payload.val().username,
        "IsAccepted": true
        });
    });
  }

  /*******************************************************
    delete friend
  ********************************************************/
  deleteFriend(f) {
    this.frs.deleteFriend(this.user,f.friend_id);
    this.frs.deleteFriend(f.friend_id, this.user);
  }


  /*******************************************************
    open friend page
  ********************************************************/
  goto_friendProfile(f) {
    this.navCtrl.push('FriendProfilePage', {
        "friend_id": f.friend_id
    });

  }



}

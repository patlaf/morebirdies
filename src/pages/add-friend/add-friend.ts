import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/users';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/do';
import { FriendRequestService } from '../../services/FriendRequestService';

/**
 * Generated class for the AddFriendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {


  userList: any[];
  displayedUserList: any;
  friendList: any;
  userID: string;
  noresult: boolean;
  searchValue: string;


  constructor(private afAuth: AngularFireAuth, private afdb : AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams, private frs : FriendRequestService) {
    this.searchValue = '';
    if(localStorage.getItem("IsUserLoggedIn") != undefined){
      this.userID = localStorage.getItem("IsUserLoggedIn");
    }
    else {
      this.afAuth.authState.subscribe(data => {
        this.userID = data.uid
      });
    }


    this.friendList = [];
    this.afdb.list(`friends/${this.userID}`).snapshotChanges().subscribe(f => {
      f.forEach(ff => {
        let json = {};
        json["IsAccepted"] = ff.payload.val().IsAccepted;
        json["friend_id"] = ff.payload.val().friend_id;
        this.friendList.push(json);
      })
    });



    // Load the user object with firebase data
    this.userList = [];
    this.afdb.list(`users`).snapshotChanges().subscribe(f => {
      f.forEach(ff => {
        // if not the current user
        if(ff.key != this.userID) {
          let json = {};
          json["key"] = ff.key;
          json["username"] = ff.payload.val().username;
          /*json["birthdate"] = ff.payload.val().birthdate;
          json["gender"] = ff.payload.val().gender
          json["handicap"] = ff.payload.val().handicap;*/

          let friend = this.friendList.filter(fff => {
            return (fff.friend_id == ff.key)
          })

          // if there is no friend, add to the list of available user
          // if there is a friend with a request pending, add it to the list
          // if there is a friend with accepted request, do not add it to the list
          if(friend.length != 0){
            if(friend.IsAccepted == false){
              json["pendingRequest"] = true;
              this.userList.push(json);
            }
          }
          else {
            json["pendingRequest"] = false;
            this.userList.push(json);
          }
        }
      })
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFriendPage');
  }

  /********************************************
    Navigate to homepage
  *********************************************/
   gotoHome() {
     this.navCtrl.setRoot('HomePage');
   }


   /********************************************
     filter the displayed friend list on key press
   *********************************************/
   filterfriendlist(ev) {
      this.noresult = false;
      this.displayedUserList = this.userList;
      this.searchValue = ev.target.value;

      let val = ev.target.value;
      //console.log(this.displayedUserList);

      if (val && val.trim() != '') {
        this.displayedUserList = this.displayedUserList.filter(obj => {
          return (obj.username.toLowerCase().indexOf(val.toLowerCase()) > -1)
        });
      }
      else {
        // search input erased, display nothing
        this.displayedUserList = this.displayedUserList.filter(obj=> { return (obj == 2)});
      }
    }


    /********************************************
      Add Friend - Send friend request to another user
    *********************************************/
    addFriend(user) {
    //  console.log(user);


      this.frs.sendFriendRequest(user.key,{
        "friend_id": this.userID,
        "IsAccepted": false,
        "requestDate": new Date().toISOString()
      });

      this.frs.addFriend(this.userID,{
        "friend_id": user.key,
        "friend_username": user.username,
        "IsAccepted": false
      });

      this.userList.filter(u => (u.key == user.key))[0].pendingRequest = true;
      this.displayedUserList.filter(u => (u.key == user.key))[0].pendingRequest = true;
  }

  /********************************************
    cancel Friend Request
  *********************************************/
  cancelFriendRequest(user){
    this.frs.cancelFriendRequest(user.key, this.userID);
    this.frs.deleteFriend(this.userID, user.key);
    user.pendingRequest = false;
  }

}

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Game } from '../models/games';

@Injectable()
export class FriendRequestService {

    private friendRequestRef;



    constructor(private db: AngularFireDatabase) {

    }

/*
    getGameList(userId : string, orderby? : string){

        this.userid = userId;
        if(orderby) {
            this.gameListRef = this.db.list(`games/${userId}`, ref => {
                return ref.orderByChild(orderby)
                }
            );
        }
        else {
            this.gameListRef = this.db.list(`games/${userId}`);
        }
        return this.gameListRef;

    }
*/
    sendFriendRequest(to_userId : string, friendrequest: any) {
      this.friendRequestRef = this.db.object(`friendrequests/${to_userId}/${friendrequest.friend_id}`);
      return this.friendRequestRef.set(friendrequest);
    }


    addFriend(userId : string, friendProfile: any) {
      this.friendRequestRef = this.db.object(`friends/${userId}/${friendProfile.friend_id}`);
      return this.friendRequestRef.set(friendProfile);
    }


    cancelFriendRequest(to_userId : string, friend_id : string) {
      this.friendRequestRef = this.db.list(`friendrequests/${to_userId}/${friend_id}`);
      return this.friendRequestRef.remove();
    }


    deleteFriend(userId : string, friend_id: string) {
      this.friendRequestRef = this.db.list(`friends/${userId}/${friend_id}`);
      return this.friendRequestRef.remove();
    }


    getFriendRequest(userId : string, orderby? : string){
      if(orderby) {
          this.friendRequestRef = this.db.list(`friendrequests/${userId}`, ref => {
              return ref.orderByChild(orderby)
              }
          );
      }
      else {
          this.friendRequestRef = this.db.list(`friendrequests/${userId}`);
      }
      return this.friendRequestRef;

    }


    getFriends(userId : string, isAccepted? : boolean, orderby? : string){

      if(isAccepted == null) isAccepted = true;


      if(orderby) {
          this.friendRequestRef = this.db.list(`friends/${userId}`, ref => {
              return ref.orderByChild('IsAccepted').equalTo(isAccepted)
              }
          );
      }
      else {
          this.friendRequestRef = this.db.list(`friends/${userId}`, ref => {
              return ref.orderByChild('IsAccepted').equalTo(isAccepted);
              });
      }
      return this.friendRequestRef;

    }





}

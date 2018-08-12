import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Game } from '../models/games';

@Injectable()
export class GameListService {

    private userid : string;
    private gameListRef = this.db.list<Game>('games');
    private birdiesListRef = this.db.list<Game>('games');


    constructor(private db: AngularFireDatabase) {

    }


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

    addGame(userId : string, game: any) {
      this.gameListRef = this.db.list(`games/${userId}`);
      return this.gameListRef.push(game);
    }


    updateGame(userId : string, gameId: string, game: any) {
      this.gameListRef = this.db.list(`games/${userId}`);
      return this.gameListRef.update(gameId, game)
    }


    deleteGame(userId: string, gameId : string) {
      this.gameListRef = this.db.list(`games/${userId}/${gameId}`);
      return this.gameListRef.remove();
    }
/*
    getBirdieList(gameId : string, orderby? : string){
        this.birdiesListRef = this.db.list<Game>(`games/${this.userid}/${gameId}/birdies_hole/`);
    }
*/
}

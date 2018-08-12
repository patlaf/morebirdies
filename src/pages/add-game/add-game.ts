import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GameListService } from '../../services/GameListService';
import { Game } from '../../models/games';
/**
 * Generated class for the AddGamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-game',
  templateUrl: 'add-game.html',
})
export class AddGamePage {

  game : any;

  course: string;
  score: number;
  isHole18: boolean;
  birdieQty: number ;
  user : string;
  birdieHoleList: any;
  gameId : string;


  constructor(private afAuth : AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private gameList : GameListService) {


    // Set the gamelist reference pointing the user
    this.afAuth.authState.subscribe(data => {
        this.user = data.uid
    });

    // Add new game mode
    if(this.navParams.get('EditGame') == ""){
      // Default values when adding
      this.course;
      this.score;
      this.birdieQty = 0;
      this.isHole18 = true;
      this.birdieHoleList = [];
    }
    // Edit a game mode
    else {
      this.game = this.navParams.get('EditGame');
      this.gameId = this.game.key;

      this.course = this.game.golfname;
      this.score = this.game.score;
      this.birdieQty = this.game.birdies;
      if(this.game.number_hole == 18) this.isHole18 = true; else this.isHole18 = false;

      this.birdieHoleList = [];
      if(this.birdieQty  > 0) {
        this.game.birdies_hole.forEach(b => {
          this.birdieHoleList.push({
              "holeList": this.initializeHoleList(b.hole),
              "birdieType": this.initializeBirdieType(b.shot),
              "distance": b.distance
          })
        });
      }



    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddGamePage');
  }

  /********************************************
    When the Number of Birdies increase or decrease
  *********************************************/
  updateBirdieNumber(sign) {
    if (sign == '+') {
      if (this.birdieQty != 18) {
        this.birdieQty++;
        this.birdieHoleList.push({
            "holeList": this.initializeHoleList(),
            "birdieType": this.initializeBirdieType(),
            "distance": 1
        })
      }
    }
    else {
      if (this.birdieQty != 0) {
          this.birdieQty--;
          this.birdieHoleList.pop();
      }
    }
  }


  /********************************************
    get the birdie details selection
  *********************************************/
  updateBirdie(item, type, index, mainindex) {
    this.birdieHoleList[mainindex][type].filter(i => {
        i.isHighlighted = false;
    })
    item.isHighlighted = true;
  }


  /********************************************
    get the birdie details selection
  *********************************************/
  updateDistance(value, mainindex) {
    this.birdieHoleList[mainindex]["distance"] = value;
  }


  /********************************************
    Get what hole (9/18) is selected
  *********************************************/
  getHoles(hole) {
    if (hole == '18') {
      this.isHole18 = true;
    } else {
      this.isHole18 = false;
    }
  }

  /********************************************
    When the Number of Birdies increase or decrease
  *********************************************/
  saveGame() {
    let hole;
    if (this.isHole18) {
      hole = 18;
    } else
      hole = 9;

    // validate mandatory fields are not empty
    if (this.course == "" || this.course == undefined || this.score == undefined) {

      // @todo : error handling and nice message
      // validate the birdies attributes are selected too

    }
    else {
      // Ugly hack to do a deep copy of birdieHoleList
      let birdieList = JSON.parse(JSON.stringify(this.birdieHoleList));
      birdieList.forEach((birdie, k) => {

        // validate if type is selected
        if(birdie.birdieType.filter(type => type.isHighlighted === true).length != 0) {
          birdie.shot = birdie.birdieType.filter(type => type.isHighlighted === true)[0].Value;
        }

        // validate if hole is selected
        if(birdie.holeList.filter(type => type.isHighlighted === true).length != 0) {
          birdie.hole = birdie.holeList.filter(type => type.isHighlighted === true)[0].Value;
        }
        
        delete birdie.birdieType;
        delete birdie.Button;
        delete birdie.holeList;
      })

      // Push to Firebase
      if(this.game){
        this.gameList.updateGame(this.user, this.gameId, {
          "golfname": this.course,
          "number_hole": hole,
          "date": new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
          "birdies": this.birdieQty,
          "birdies_hole": birdieList,
          "score": this.score
        })
      }
      else {
        this.gameList.addGame(this.user,{
          "golfname": this.course,
          "number_hole": hole,
          "date": new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
          "birdies": this.birdieQty,
          "birdies_hole": birdieList,
          "score": this.score
        })
    }
      this.navCtrl.setRoot('HomePage');
    }
  }

 /********************************************
   Navigate to homepage
 *********************************************/
  gotoHome() {
    this.navCtrl.setRoot('HomePage');
  }



  /********************************************
    return the hole list when adding a new birdie
  *********************************************/
  initializeHoleList(index? : number){

    let listTemplate = [{
            "Value": 1,
            "isHighlighted": false
        },
        {
            "Value": 2,
            "isHighlighted": false
        },
        {
            "Value": 3,
            "isHighlighted": false
        },
        {
            "Value": 4,
            "isHighlighted": false
        },
        {
            "Value": 5,
            "isHighlighted": false
        },
        {
            "Value": 6,
            "isHighlighted": false
        },
        {
            "Value": 7,
            "isHighlighted": false
        },
        {
            "Value": 8,
            "isHighlighted": false
        },
        {
            "Value": 9,
            "isHighlighted": false
        },
        {
            "Value": 10,
            "isHighlighted": false
        },
        {
            "Value": 11,
            "isHighlighted": false
        },
        {
            "Value": 12,
            "isHighlighted": false
        },
        {
            "Value": 13,
            "isHighlighted": false
        },
        {
            "Value": 14,
            "isHighlighted": false
        },
        {
            "Value": 15,
            "isHighlighted": false
        },
        {
            "Value": 16,
            "isHighlighted": false
        },
        {
            "Value": 17,
            "isHighlighted": false
        },
        {
            "Value": 18,
            "isHighlighted": false
        }


    ];

    if(index) {
      listTemplate[index-1].isHighlighted = true;
    }

    return listTemplate;
  }


  /********************************************
    return the birdie type  when adding a new birdie
  *********************************************/
  initializeBirdieType(type?: string) {
      let birdieTypeTemplate = [{
              "Value": "Putt",
              "isHighlighted": false
          },
          {
              "Value": "Flop",
              "isHighlighted": false
          },
          {
              "Value": "Sand",
              "isHighlighted": false
          },
          {
              "Value": "Clip",
              "isHighlighted": false
          },
          {
              "Value": "Pitch",
              "isHighlighted": false
          },
          {
              "Value": "Full Shot",
              "isHighlighted": false
          }
      ];


      if(type) {
        birdieTypeTemplate.filter(t => t.Value === type)[0].isHighlighted = true
      }

      return birdieTypeTemplate;


  }

}

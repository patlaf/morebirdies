import { Birdies } from './birdies';


export interface Game {

    golfname: string;
    number_hole: string;
    date: string;
    birdies: number;
    achievement?: number;
    score: number;
    birdies_list?: {
      [key: number] :  Birdies
    };
}

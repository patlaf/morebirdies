import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddGamePage } from './add-game';

@NgModule({
  declarations: [
    AddGamePage,
  ],
  imports: [
    IonicPageModule.forChild(AddGamePage),
  ],
})
export class AddGamePageModule {}

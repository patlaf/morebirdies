import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfileLightPage } from './user-profile-light';

@NgModule({
  declarations: [
    UserProfileLightPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfileLightPage),
  ],
})
export class UserProfileLightPageModule {}

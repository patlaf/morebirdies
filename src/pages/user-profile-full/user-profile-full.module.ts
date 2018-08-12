import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserProfileFullPage } from './user-profile-full';

@NgModule({
  declarations: [
    UserProfileFullPage,
  ],
  imports: [
    IonicPageModule.forChild(UserProfileFullPage),
  ],
})
export class UserProfileFullPageModule {}

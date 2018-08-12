import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginChoicePage } from './login-choice';

@NgModule({
  declarations: [
    LoginChoicePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginChoicePage),
  ],
})
export class LoginChoicePageModule {}

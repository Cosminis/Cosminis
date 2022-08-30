import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllCosminisComponent } from './all-cosminis/all-cosminis.component';
import { CosminisGoComponent } from './cosminis-go/cosminis-go.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ShopMenuComponent } from './shop-menu/shop-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GemSpendingMenuComponent } from './gem-spending-menu/gem-spending-menu.component';
import { LotteryComponent } from './lottery/lottery.component';

const routes: Routes = [
  { 
    path: 'homepage', 
    component:HomepageComponent
  },  // you must add your component here
  {
    path: 'userprofile', 
    component:UserprofileComponent
  },
  {
    path: 'login', 
    component:LoginComponent
  },
  {
    path: 'Go', 
    component:CosminisGoComponent
  },
  {
    path: 'MyBabies', 
    component:AllCosminisComponent
  },
  {
    path: 'shop', 
    component:ShopMenuComponent
  },
  {
    path: 'GemSpendingShop',
    component:GemSpendingMenuComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'lottery',
    component:LotteryComponent
  },
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

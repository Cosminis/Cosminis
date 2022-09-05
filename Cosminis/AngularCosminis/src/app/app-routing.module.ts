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
import { PaymentComponent } from './payment/payment.component';
import { LotteryComponent } from './lottery/lottery.component';
import { SelectBattleComponent } from './select-battle/select-battle.component'; 
import { BattleMenuComponent } from './battle-menu/battle-menu.component'; 

const routes: Routes = [
  { 
    path: 'homepage', 
    component:HomepageComponent
  },  // you must add your component here
  {
    path: 'userprofile', 
    component: UserprofileComponent
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'Go', 
    component: CosminisGoComponent
  },
  {
    path: 'MyBabies', 
    component: AllCosminisComponent
  },
  {
    path: 'shop', 
    component: ShopMenuComponent
  },{
    path: 'lottery',
    component: LotteryComponent
  },
  {
    path: 'GemSpendingShop',
    component: GemSpendingMenuComponent
  },
  {
    path: 'Battle/Selection', 
    component: SelectBattleComponent
  },
  {
    path: 'Battle/Menu', 
    component: BattleMenuComponent
  },
  {
    path: 'GemPurchaseShop',
    component:PaymentComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

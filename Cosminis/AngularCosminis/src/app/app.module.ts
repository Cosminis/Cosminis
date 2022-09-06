import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '@auth0/auth0-angular';
import { environment as env } from '../environments/environment';
import { CosminisGoComponent } from './cosminis-go/cosminis-go.component';
import { AllCosminisComponent } from './all-cosminis/all-cosminis.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { ShopMenuComponent } from './shop-menu/shop-menu.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { GemSpendingMenuComponent } from './gem-spending-menu/gem-spending-menu.component';
import { LotteryComponent } from './lottery/lottery.component'; 
import { PaymentComponent } from './payment/payment.component';
import { CcformComponent } from '././payment/ccform/ccform.component';
import { SelectBattleComponent } from './select-battle/select-battle.component'; 
import { BattleMenuComponent } from './battle-menu/battle-menu.component'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    UserprofileComponent,
    CosminisGoComponent,
    AllCosminisComponent,
    NavbarComponent,
    ShopMenuComponent,
    InteractionsComponent,
    GemSpendingMenuComponent,
    PaymentComponent,
    CcformComponent,
    GemSpendingMenuComponent, 
    LotteryComponent,
    PaymentComponent,
    SelectBattleComponent, 
    BattleMenuComponent 
    //AppLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AuthModule.forRoot
    ({
      ... env.auth,
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

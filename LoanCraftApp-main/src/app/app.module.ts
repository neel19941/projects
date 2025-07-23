import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BodyComponent } from './components/body/body.component';
import { TopnavComponent } from './components/topnav/topnav.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SidenavComponent,
    BodyComponent,
    TopnavComponent,
    NgToastModule,
    FooterComponent,
    FormsModule,
    ReactiveFormsModule,
   
  ],
  providers: [{
    provide : HTTP_INTERCEPTORS,
    useClass :  TokenInterceptor,
    multi : true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

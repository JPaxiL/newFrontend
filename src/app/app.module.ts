import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



import { NgxsModule } from '@ngxs/store';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { AuthState } from './core/store/auth.state';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxsModule.forRoot([AuthState]),
    AppRoutingModule,
    NgbModule,
    NgxsStoragePluginModule.forRoot({
      key: ['auth.token', 'auth.access_token', 'auth.name', 'auth.expires_in', 'auth.refresh_token']
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatVideoModule } from 'mat-video';
import { VideoDisplayComponent } from './video-display/video-display.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VideoDisplayComponent,
    StatsDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatVideoModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

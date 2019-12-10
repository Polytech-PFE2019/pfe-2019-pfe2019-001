import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatVideoModule } from 'mat-video';
import { VideoDisplayComponent, DialogAlbum } from './video-display/video-display.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResourcesMonitorComponent } from './resources-monitor/resources-monitor.component';

import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { SettingsComponent } from './settings/settings.component';

import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BirdComparatorComponent } from './bird-comparator/bird-comparator.component';
import { AlbumComponent, AlbumDetailComponent } from './album/album.component';

import 'hammerjs'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save hammerjs`)
import 'mousetrap'; // Mandatory for angular-modal-gallery 3.x.x or greater (`npm i --save mousetrap`)
import { GalleryModule } from '@ks89/angular-modal-gallery'; // <----------------- angular-modal-gallery library


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    VideoDisplayComponent,
    StatsDisplayComponent,
    ResourcesMonitorComponent,
    SettingsComponent,
    DialogAlbum,
    AlbumComponent,
    BirdComparatorComponent,
    AlbumDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatVideoModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, 'bird'),
    AngularFireDatabaseModule,
    MatInputModule, FormsModule, ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatAutocompleteModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GalleryModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogAlbum, AlbumDetailComponent]
})
export class AppModule { }

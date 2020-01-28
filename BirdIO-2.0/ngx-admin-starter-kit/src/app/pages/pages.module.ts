import { NgModule } from '@angular/core';
import { NbMenuModule, NbCardModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { AlbumComponent } from './album/album.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { ResourcesMonitorComponent } from './resources-monitor/resources-monitor.component';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BirdComparatorComponent } from './bird-comparator/bird-comparator.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MatDialogModule,
    NbCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSlideToggleModule

  ],
  declarations: [
    PagesComponent,
    AlbumComponent,
    StatsDisplayComponent,
    ResourcesMonitorComponent,
    VideoDisplayComponent,
    BirdComparatorComponent
  ],
})
export class PagesModule {
}

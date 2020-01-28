import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlbumComponent } from './album/album.component';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { ResourcesMonitorComponent } from './resources-monitor/resources-monitor.component';
import { VideoDisplayComponent } from './video-display/video-display.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      component: DashboardComponent,
    }, {
      path: 'album',
      component: AlbumComponent,
    }, {
      path: 'statistics',
      component: StatsDisplayComponent,
    }, {
      path: 'ressources',
      component: ResourcesMonitorComponent,
    }, {
      path: 'stream',
      component: VideoDisplayComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { ResourcesMonitorComponent } from './resources-monitor/resources-monitor.component';


const routes: Routes = [{
    path: 'videoDisplay',
    component: VideoDisplayComponent
  },{
      path: 'statsDisplay',
      component: StatsDisplayComponent
    },
    {
        path: 'resourcesMonitor',
        component: ResourcesMonitorComponent
      }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

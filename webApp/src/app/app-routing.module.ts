import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoDisplayComponent } from './video-display/video-display.component';
import { StatsDisplayComponent } from './stats-display/stats-display.component';
import { ResourcesMonitorComponent } from './resources-monitor/resources-monitor.component';
import { SettingsComponent } from './settings/settings.component';
import { AlbumComponent } from './album/album.component';
import { DebugComponent } from './debug/debug.component';


const routes: Routes = [{
  path: 'videoDisplay',
  component: VideoDisplayComponent
}, {
  path: 'statsDisplay',
  component: StatsDisplayComponent
},
{
  path: 'resourcesMonitor',
  component: ResourcesMonitorComponent
},
{
  path: 'settings',
  component: SettingsComponent
},
{
  path: 'album',
  component: AlbumComponent
},
{
  path: 'debug',
  component: DebugComponent
},]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from 'angularfire2/database';
import { Water } from '../models';

@Component({
  selector: 'app-resources-monitor',
  templateUrl: './resources-monitor.component.html',
  styleUrls: ['./resources-monitor.component.scss']
})
export class ResourcesMonitorComponent implements OnInit {

  food = true;
  water = true;
  products = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService) { }

  ngOnInit() {

    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data: any[])=>{
      console.log(data);
      this.products = data;
    })

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}

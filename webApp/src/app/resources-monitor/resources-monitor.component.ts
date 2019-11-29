import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

<<<<<<< HEAD
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data: any[])=>{
      console.log(data["water"]);
      this.products = data;

      if(data["water"] == true){
        this.water = true;
      }else if(data["water"] == false){
=======
    this.dataService.sendGetRequest().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      console.log(data.water);
      this.products = data;

      if (data.water == true) {
        this.water = true;
      } else if (data.water == false) {
>>>>>>> be43d96fa15ca336e7298024251bb619e1458037
        this.water = false;
      }
    })

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SocketService } from '../services/SocketService';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { localServer } from '../../environments/environment';

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

  constructor(private socket: SocketService, private http: HttpClient) { }

  ngOnInit() {

    this.socket.water.subscribe((data) => {
      this.water = data;
    })

    this.socket.food.subscribe((data) => {
      this.food = data;
    })

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public etalon(){
    console.log("yolo");
    const headers = new HttpHeaders()
    return this.http.post(localServer+'/food/setEtalon',true, {
      headers: headers
    }).subscribe(data => {
      console.log(data);
    });
  }

}

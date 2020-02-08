import { Injectable } from "@angular/core";
import { ChildActivationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { localServer } from '../environments/environment';



@Injectable({ providedIn: "root" })
export class DbService {
    constructor(private http: HttpClient) {

    }

    getAlbums() {
        return this.http.get(localServer + "/image/").toPromise();
    }

    getWaterAverage() {
      return this.http.get<any>(localServer + "/stats/water").toPromise();
    }

    getBirdsDaily(day, month, year) {
      day = parseInt(day, 10) - 1;
      month = parseInt(month, 10) - 1;
      year = parseInt(year, 10);
      return this.http.get<any[]>(localServer + "/stats/", {params: {day: day, month: month, year: year}}).toPromise();
    }

    getBirdsMonthly(month, year) {
      let day: any = 0;
      month = parseInt(month, 10) - 1;
      year = parseInt(year, 10);
      return this.http.get<any[]>(localServer + "/stats/", {params: {day: day, month: month, year: year}}).toPromise();
    }

    getBirdsYearly(year) {
      let day: any = 0;
      let month: any = 0;
      year = parseInt(year, 10);
      return this.http.get<any[]>(localServer + "/stats/", {params: {day: day, month: month, year: year}}).toPromise();
    }

    getImgInAlbums(name) {
        return this.http.get(localServer + "/image/" + name).toPromise();
    }

    addImage(name, image) {
        return this.http.post(localServer + "/image/add", { name: name, b64: image }).toPromise();
    }
}

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

    getBirdStats() {
      var mock = []
      mock.push({date: 1581073922546, state: true})
      mock.push({date: 1581074115285, state: false})
      mock.push({date: 1581074151077, state: true})
      mock.push({date: 1581074160742, state: false})
      return mock;
    }

    getBirdsDaily(day, month, year) {

    }

    getBirdsMonthly(month, year) {

    }

    getBirdsYearly(year) {

    }

    getImgInAlbums(name) {
        return this.http.get(localServer + "/image/" + name).toPromise();
    }

    addImage(name, image) {
        return this.http.post(localServer + "/image/add", { name: name, b64: image }).toPromise();
    }
}

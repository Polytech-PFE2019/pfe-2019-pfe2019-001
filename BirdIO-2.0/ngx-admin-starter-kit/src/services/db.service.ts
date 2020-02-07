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

    getImgInAlbums(name) {
        return this.http.get(localServer + "/image/" + name).toPromise();
    }

    addImage() {
        return this.http.get(localServer + "/image/add").toPromise();
    }
}
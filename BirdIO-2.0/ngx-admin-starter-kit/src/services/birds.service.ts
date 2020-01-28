import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BirdsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'X-eBirdApiToken': '6drnfgc16fl0'
    })
  };

  constructor(private http: HttpClient) { }

  getBirdsNearby() {
    return new Promise((resolve, reject) => {
      var url = "https://api.ebird.org/v2/data/obs/geo/recent?lat=" + 43.62 + "&lng=" + 7.09 + "&sort=species&dist=50"
      this.http.get(url, this.httpOptions).subscribe((data) => {
        resolve(data);
      });
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }

  getBirdImage(birdName) {
    return new Promise((resolve, reject) => {
      var url = 'https://pixabay.com/api/?key=14565124-20d106548d918dd574d0e50d8&safesearch=true&per_page=3&q=' + birdName;
      this.http.get(url).subscribe((data) => {
        resolve(data);
      });
    });
  }
}

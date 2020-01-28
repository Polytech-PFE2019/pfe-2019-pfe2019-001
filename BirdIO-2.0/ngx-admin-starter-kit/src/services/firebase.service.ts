import { Injectable } from "@angular/core";
import * as firebase from 'firebase';
import { ChildActivationEnd } from '@angular/router';



@Injectable({ providedIn: "root" })
export class firebaseService {
    constructor() {
        const config = {
            apiKey: "AIzaSyCncb_SkW0LNdf2phmjahcwr5R3KOGQzDM",
            authDomain: "bird-c45f2.firebaseapp.com",
            databaseURL: "https://bird-c45f2.firebaseio.com",
            projectId: "bird-c45f2",
            storageBucket: "bird-c45f2.appspot.com",
            messagingSenderId: "687579025809",
            appId: "1:687579025809:web:33036a6e9e2983f6da8a30"
        };
        firebase.initializeApp(config);
    }

    getDatabase() {
        return firebase.database();
    }

    push(ref, data) {
        firebase.database().ref(ref).push(data)
    }

    getAlbums() {
        return new Promise((resolve, reject) => {
            var albums = [];
            var temp = [];
            var albumRef = this.getDatabase().ref('picture');
            albumRef.once('value', (snapshot) => {
                snapshot.forEach(function (_child) {
                    _child.forEach(function (wtf) {
                        temp.push(wtf.val())
                    })
                    albums.push({ name: _child.key, photos: temp });
                    temp = [];
                    console.log(albums)
                });
                resolve(albums);
            });
        });
    }

}

import { Injectable } from "@angular/core";
import * as firebase from 'firebase';



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

}
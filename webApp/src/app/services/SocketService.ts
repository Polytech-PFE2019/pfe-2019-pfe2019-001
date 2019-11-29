import * as io from "socket.io-client";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";


@Injectable({ providedIn: "root" })
export class SocketService {
    private url = "http://localhost:1337";
    private socket;
    public water = new Subject<boolean>();
    public pres = new Subject<boolean>();


    constructor(private router: Router) {
        this.socket = io(this.url);
        this.water.next(false)

        this.socket.on("water", (data) => {
            console.log("ok")
            this.water.next(data)
        });

        this.socket.on('presence', (pres) => {
            this.pres = pres;
        });

        this.socket.on("connect_error", (exeception) => {
            this.pres.next(false);
        });

        this.socket.on("connect_timeout", (timeout) => {
            this.pres.next(false);
            console.log("timeout");
        });

        this.socket.on('error', (error) => {
            this.pres.next(false);
            console.log("timeout");
        });
    }

    init() {

    }


}
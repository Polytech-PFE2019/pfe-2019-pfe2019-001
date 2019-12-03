import * as io from "socket.io-client";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ThrowStmt } from '@angular/compiler';


@Injectable({ providedIn: "root" })
export class SocketService {
    private url = "http://localhost:1337";
    private socket;
    public water = new Subject<boolean>();
    public food = new Subject<boolean>();
    public errorCred = new Subject<boolean>();
    public pres = new Subject<boolean>();
    public error = new Subject<boolean>();


    constructor(private router: Router) {
        this.socket = io(this.url);
        this.init();

        this.socket.on("water", (data) => {
            console.log("ok")
            this.water.next(data)
        });

        this.socket.on("food", (data) => {
            console.log("ok")
            this.food.next(data)
        });

        this.socket.on("errorCred", (data) => {
            console.log("ok")
            this.errorCred.next(data)
        });

        this.socket.on('presence', (pres) => {
            this.pres = pres;
        });

        this.socket.on("connect_error", (exeception) => {
            this.error.next(true);
        });

        this.socket.on("connect_timeout", (timeout) => {
            this.error.next(true);
            console.log("timeout");
        });

        this.socket.on('error', (error) => {
            this.error.next(true);
            console.log("timeout");
        });
    }

    init() {
        this.water.next(false);
        this.food.next(false);
        this.pres.next(false);
        this.error.next(false);
        this.errorCred.next(false);
    }

    emitName(sock, value){
      this.socket.emit(sock,value);
    }

    emitMail(sock, value){
      this.socket.emit(sock,value);
    }


}

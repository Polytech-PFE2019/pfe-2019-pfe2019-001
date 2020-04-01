import * as io from "socket.io-client";
import { Injectable, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { localServer } from '../environments/environment';


@Injectable({ providedIn: "root" })
export class SocketService {
    private socket;
    public water : EventEmitter<any> = new EventEmitter();
    public food : EventEmitter<any> = new EventEmitter();
    public errorCred = new Subject<boolean>();
    public pres : EventEmitter<any> = new EventEmitter();
    public error = new Subject<boolean>();


    constructor(private router: Router) {
        this.socket = io(localServer);
        this.init();

        this.socket.on("water", (data) => {
            this.water.emit(data);
        });

        this.socket.on("food", (data) => {
            this.food.emit(data);
        });

        this.socket.on('presence', (pres) => {
            this.pres.emit(pres);
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
        this.error.next(false);
        this.errorCred.next(false);
    }

    emitName(sock, value) {
        this.socket.emit(sock, value);
    }

    emitMail(sock, value) {
        this.socket.emit(sock, value);
    }


}

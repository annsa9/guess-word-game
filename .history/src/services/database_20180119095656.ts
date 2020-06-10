import { Injectable } from '@angular/core';
import { AlertController, Platform, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Database {

    private isOpen: boolean;
    public isDatabaseConnectionOpen: boolean = false;
    public isDatabaseDataExist: boolean = false;
    
    public constructor(public alert: AlertController, public events: Events, private http: Http, 
        public platform: Platform) {
        this.platform.ready().then(() => {

        });
    }

}
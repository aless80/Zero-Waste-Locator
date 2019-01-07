import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Alert, AlertType } from '../models/alert';
//import { Router, NavigationStart } from '@angular/router';

@Injectable()
export class AlertService {
    private subject = new Subject<Alert>();
    //private keepAfterRouteChange = false;

    constructor(){//private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        /*router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });*/
    }

    // subscribe to alerts
    getAlert(alertId?: string): Observable<any> {
        return this.subject.asObservable().pipe(filter((x: Alert) => x && x.alertId === alertId));
    }

    // convenience methods
    success(message: string, timeout = 1000) {
        this.alert(new Alert({ message, type: AlertType.Success }));
        setTimeout(() => this.clear(), timeout);
    }

    error(message: string, timeout = 1000) {
        this.alert(new Alert({ message, type: AlertType.Error }));
        setTimeout(() => this.clear(), timeout);
    }

    info(message: string, timeout = 1000) {
        this.alert(new Alert({ message, type: AlertType.Info }));
        setTimeout(() => this.clear(), timeout);
    }

    warn(message: string, timeout = 1000) {
        this.alert(new Alert({ message, type: AlertType.Warning }));
        setTimeout(() => this.clear(), timeout);
    }

    // main alert method    
    alert(alert: Alert) {
        //this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    // clear alerts
    clear(alertId?: string) {
        this.subject.next(new Alert({ alertId }));
    }
}
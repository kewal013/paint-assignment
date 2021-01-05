import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpCall {
    constructor(private http: Http) {
    }
    getMethod(url: any) {
        return this.http.get(url).map((response: any) => response.json());
    }
}
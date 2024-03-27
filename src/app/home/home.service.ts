import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as enviromentComponent from '../enviroment/enviroment.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  url: any;
  constructor(private _http: HttpClient) {
    this.url = enviromentComponent.environment.url;
  }
  getDatabyCi( cedula:any): Observable<any> {
    console.log("cedula in¡gresada:" +cedula);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `https://gadmaapps.ambato.gob.ec:9001/apex/gadmapps/hr/rubrosdeudasced/${cedula}`,
      { headers }
    );
  }
  getDatabyCIU( ciu:any): Observable<any> {
    console.log("cedula in¡gresada:" +ciu)
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(
      `https://gadmaapps.ambato.gob.ec:9001/apex/gadmapps/hr/rubrosdeudasciu/${ciu}`,
      { headers }
    );
  }
}

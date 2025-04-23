import { Injectable } from "@angular/core";
import { environment } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class ErrorsService {
    readonly url = `${environment.apiUrl}`
    constructor(private http: HttpClient) { }

    getLoginError(user: string): Observable<any> {
        return this.http.get<any>(`${this.url}errors/${user}`);
    }
}
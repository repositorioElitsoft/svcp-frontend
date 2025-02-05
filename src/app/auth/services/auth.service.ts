import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    readonly url = `${environment.apiUrl}`

    public currentUser: any = null;

    constructor(private http: HttpClient) {
        const token = this.getToken();
        this.currentUser = token ? { token } : null;
    }

    isAuthenticatedUser() {

        if (this.getToken()) {
            try {
                const token = jwtDecode(String(this.getToken()));
                this.currentUser = token;
                console.log("current user from token:", token)
            }
            catch {
                return false
            }
            return true
        }
        return false;
    }
    getToken(): string | null {
        return localStorage.getItem("token");
    }
    logout() { }
    getUserId(): number | null {
        const usuario: any = this.getUserId();
        return usuario?.id ?? null;
    }

    getAuthorities(): Set<string> {
        return new Set(this.currentUser?.authorities)
    }

    login(username: string, password: string): Observable<any> {
        const body = { username, password };
        console.log("url", this.url)
        return this.http.post(`${this.url}api/v1/auth/login`, body);
    };

}

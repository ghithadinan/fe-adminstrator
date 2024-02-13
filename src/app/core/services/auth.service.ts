import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/auth.models';
import {HttpClient} from '@angular/common/http';
import {first, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiHost}/auth`;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(email: string, password: string, onDone: any, onError: any) {
    return this.http.post<any>(`${this.apiUrl}/login-administrator`, {email, password})
      .pipe(map(response => {
        const responseData: any = response.data;
        // login successful if there's a jwt token in the response
        if (responseData) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', responseData.accessToken);
          localStorage.setItem('tokenExpired', responseData.expired);
          this.setCurrentUser(responseData.user);
        }
        return response;
      })).pipe(first())
      .subscribe(
        data => {
          onDone(data);
        }, error => {
          onError(error?.message ?? '');
        });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpired');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}

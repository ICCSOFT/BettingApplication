import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap, shareReplay} from 'rxjs/operators';
import jwt_decode from 'jwt-decode'
// import * as jwtDecode from 'jwt-decode';
import * as moment from 'moment';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class BetappService {
 
   
    // the token expiration date
    public token_expires: Date;
   
    // the username of the logged in user
    public username: string;

  baseurl = "http://127.0.0.1:8000";
  private apiRoot  = "http://127.0.0.1:8000/";

  httpHeaders = new HttpHeaders({'Content-type': 'application/json', 'Authorization': 'bearer '+ 'getToken()'});
  constructor(private http: HttpClient,
    private router: Router) {  }

  private setSession(authResult){
    const token = authResult.token;
    const payload = jwt_decode<JwtPayload>(token);
    const expiresAt = moment.unix(payload.exp);


    sessionStorage.setItem('token', authResult.token);
    sessionStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  get token(): string {
    return sessionStorage.getItem('token')
  }

  registerUser(userData): Observable<any> {
    return this.http.post(this.baseurl + '/users/', userData)
  }
  
  loginUser(userData) {
    return this.http.post(this.apiRoot.concat('api-token-auth/'), userData).pipe(
      tap(response => this.setSession(response)),
      shareReplay(),
    );
  }
  
  getloginUser(username): Observable<any>{
    return this.http.get(this.baseurl + '/users/?username=' + username, {headers: this.httpHeaders})
  }
  // public loginUser(userData) {
  //   return this.http.post(this.baseurl + '/api-token-auth/', JSON.stringify(userData), {headers: this.httpHeaders})
  // }
  logout(){
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('username')
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('role');
    localStorage.clear()
  }
  loggedIn() {
    return sessionStorage.getItem('token')
  }

  getToken() {
    return sessionStorage.getItem('token')
  }

    // Refreshes the JWT token, to extend the time the user is logged in
  // public refreshToken(tokens) {
  //   return this.http.post(this.baseurl + '/api-token-refresh/', JSON.stringify({token: tokens}), {headers: this.httpHeaders})
  // }

  refreshToken() {
    if (moment().isBetween(this.getExpiration().subtract(1, 'days'), this.getExpiration())) {
      return this.http.post(
        this.apiRoot.concat('api-token-auth/'),
        { token: this.token }
      ).pipe(
        tap(response => this.setSession(response)),
        shareReplay(),
      )
    }
  }
  
  getExpiration() {
    const expiration = sessionStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);

    return moment(expiresAt);
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  


  getAllMatches(): Observable<any>{
    return this.http.get(this.baseurl + '/matches/', {headers: this.httpHeaders})
  }
  getOneMatch(id): Observable<any>{
    return this.http.get(this.baseurl + '/matches/' + id + '/', {headers: this.httpHeaders})
  }
  deleteMatch(id): Observable<any>{
    return this.http.delete(this.baseurl + '/matches/' + id + '/', {headers: this.httpHeaders})
  }

  getOneOrder(username): Observable<any>{
    return this.http.get(this.baseurl + '/order/?username=' + username, {headers: this.httpHeaders})
  }

  placeBet(item): Observable<any>{
    const body = {customer_name:item.customer_name, match:item.match, odd:item.odd, stake_amount:item.stake_amount, possible_winning:item.possible_winning};
    return this.http.post(this.baseurl + '/order/', body, {headers: this.httpHeaders});
  }
}


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'JWT '.concat(token))
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: BetappService, private router: Router) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      this.authService.refreshToken();

      return true;
    } else {
      this.authService.logout();
      this.router.navigate(['matches']);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: 'Please login',
        showConfirmButton: false,
        timer: 2000
      })
      return false;
    }
  }
}

interface JwtPayload {
  exp: number;
  user_id: number;
  username: string;
  email: string;
}
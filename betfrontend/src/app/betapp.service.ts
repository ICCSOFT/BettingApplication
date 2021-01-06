import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs';
import { tap, shareReplay} from 'rxjs/operators';
import jwt_decode from 'jwt-decode'
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class BetappService {

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

  getUserTransaction(customer): Observable<any>{
    return this.http.get(this.baseurl + '/transaction/?username='+ customer, {headers: this.httpHeaders});
  }

  getUserAccount(username): Observable<any>{
    return this.http.get(this.baseurl + '/account/?username='+ username, {headers: this.httpHeaders});
  }

  getOneUser(username): Observable<any>{
    return this.http.get(this.baseurl + '/users/?username='+ username, {headers: this.httpHeaders})
  
  }
  
  registerDeposit(item): Observable<any> {
    const body = {customer_name:item.customer_name, amount:item.amount, desc:item.desc};
    return this.http.post(this.baseurl + '/transaction/', body, {headers: this.httpHeaders})
  }  
 
  registerWithdrawal(item_): Observable<any> {
    const body_ = {customer_name:item_.customer_name, amount:item_.amount, desc:item_.desc};
    return this.http.post(this.baseurl + '/transaction/', body_, {headers: this.httpHeaders})
  }

  registerUser(userData): Observable<any> {
    return this.http.post(this.baseurl + '/users/', userData)
  }
  
  loginUser(userData) {
    return this.http.post(this.apiRoot.concat('api-token-auth/'), userData).pipe(
      tap(response => this.setSession(response)), shareReplay(),
    );
  }
  
  getloginUser(username): Observable<any>{
    return this.http.get(this.baseurl + '/users/?username=' + username, {headers: this.httpHeaders})
  }

  getAllMatches(): Observable<any>{
    return this.http.get(this.baseurl + '/matches/', {headers: this.httpHeaders})
  }

  getAllUsers(): Observable<any>{
    return this.http.get(this.baseurl + '/users/', {headers: this.httpHeaders})
  }

  getAllScores(): Observable<any>{
    return this.http.get(this.baseurl + '/scores/', {headers: this.httpHeaders})
  }

  getAllOrder(): Observable<any>{
    return this.http.get(this.baseurl + '/order/', {headers: this.httpHeaders})
  }

  getOneMatch(id): Observable<any>{
    return this.http.get(this.baseurl + '/matches/' + id + '/', {headers: this.httpHeaders})
  }
  updateUser(state): Observable<any>{
    const body = {id:state.id, is_active: state.is_active};
    return this.http.post(this.baseurl + '/deactivate/', body, {headers: this.httpHeaders})
  }
  
  deleteMatch(id): Observable<any>{
    return this.http.delete(this.baseurl + '/matches/' + id + '/', {headers: this.httpHeaders})
  }
  deleteUser(id): Observable<any>{
    return this.http.delete(this.baseurl + '/users/' + id + '/', {headers: this.httpHeaders})
  }
  deleteOrder(id): Observable<any>{
    return this.http.delete(this.baseurl + '/order/' + id + '/', {headers: this.httpHeaders})
  }

  setOneOrder(bet): Observable<any>{
    const body = {match:bet.match,odd:bet.odd,stake_amount:bet.stake_amount,possible_winning:bet.possible_winning,finished:'True'}
    return this.http.put(this.baseurl + '/order/'+ bet.id +'/?username=' + bet.username, body, {headers: this.httpHeaders})
  }

  getOneOrder(username): Observable<any>{
    return this.http.get(this.baseurl + '/order/?username=' + username, {headers: this.httpHeaders})
  }

  getOneBet(id): Observable<any>{
    return this.http.get(this.baseurl + '/order/' + id + '/', {headers: this.httpHeaders})
  }

  updateBet(state): Observable<any>{
    const body = {id:state.id, cancelled: state.cancelled};
    return this.http.post(this.baseurl + '/activate/', body, {headers: this.httpHeaders})
  }

  placeBet(item): Observable<any>{
    const body = {customer_name:item.customer_name, match:item.match, odd:item.odd, stake_amount:item.stake_amount, possible_winning:item.possible_winning};
    return this.http.post(this.baseurl + '/order/', body, {headers: this.httpHeaders});
  }

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
import { Component} from '@angular/core';
import { BetappService } from './betapp.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
      // the actual JWT token
      public token: string;
      loginData;
      userData;   
      role; 
      // the token expiration date
      public token_expires: Date;
     
      // the username of the logged in user
      username: string;
     
      // error messages received from the login attempt
      public errors: any = [];
      
  input;
  constructor(private api: BetappService,
              private router: Router 
                
    ){ this.username =  sessionStorage.getItem('username')  }

  ngOnInit() {
    this.input = {
      fullname:'',
      username: '',
      phone: '',
      password: '',
      email: ''
    };
  }

  onLogin(loginData = {'username': this.input.username, 'password': this.input.password}){
    this.api.loginUser(loginData).subscribe(
      data => {
        this.api.getloginUser(loginData.username).subscribe(
          data =>{
            this.userData = data

            this.username = this.userData[0].username
            sessionStorage.setItem('username', this.username)

            this.role = this.userData[0].is_superuser
            sessionStorage.setItem('role',this.role)
          }
        )
        this.updateData(data['token']);
        console.log(data)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User ' + loginData.username + ' has been logged in!',
          showConfirmButton: false,
          timer: 2000
        })
        this.router.navigate(['/matches'])
      },
      err => {
        Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong Password or Username',
                showConfirmButton: false,
                timer: 2000
              })
        this.errors = err['error'];
      }
    );
  }


  logout(){
    this.api.logout()
    this.refresh()
    }

  refresh(): void {
    window.location.reload();
    }
  logins(){
    if(this.api.loggedIn()){
      return true
    }else{
      return false
    }
  }

  refreshToken() {
    this.api.refreshToken().subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  userrole = () => {
    if(sessionStorage.getItem('role') === 'true' && this.username)
    return true
  }

  tokeniser() {
    if(sessionStorage.getItem('token')){
      return true
    }else {
      return false
    }
  }
  private updateData(token) {
    this.token = token;
    this.errors = [];
  
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

}

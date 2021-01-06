import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BetappService } from '../betapp.service';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-registerpage',
  templateUrl: './registerpage.component.html',
  styleUrls: ['./registerpage.component.css'],
  providers: [BetappService]
})
export class RegisterpageComponent implements OnInit{
  input;
  loading = false;
  disabledAgreement: boolean = true;
  form: any;
  userData: any;
  username: any;
  role;
  changeCheck(event){
    this.disabledAgreement = !event.target.checked;
  }
  constructor(private api: BetappService,
              private router: Router 
    ) { }

  ngOnInit() {
    this.input = {
      fullname:'',
      username: '',
      phone: '',
      password: '',
      email: ''
    };
  }

  refresh(): void {
    window.location.reload();
  }

  onRegister() {
    let myCompOneObj = new AppComponent(this.api, this.router);

    this.loading =true;
    this.api.registerUser(this.input).subscribe(
    data => {
      myCompOneObj.onLogin({'username': this.input.username, 'password': this.input.password});
      this.api.getloginUser(this.input.username).subscribe(
        data =>{
          this.userData = data

          this.username = this.userData[0].username
          sessionStorage.setItem('username', this.username)
          
          this.role = this.userData[0].is_superuser
          sessionStorage.setItem('role',this.role)
        }
      )
      this.router.navigate(['/matches'])
    },
    error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: error.error.username,
        showConfirmButton: false,
        timer: 2000
      })
      console.log(error)
      this.loading = false;
    }
    );
  }
}

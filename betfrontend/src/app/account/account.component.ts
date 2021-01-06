import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BetappService } from '../betapp.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers: [BetappService]
})

export class AccountComponent implements OnInit {
infos = {
      fullname:'',
      username: '',
      phone: '',
      email: ''
    };
transactions;
solde;
accounts;
account;
transaction;
money_;
input;
input_;
money;
loading = false;
topics = ['Orange', 'MTN'];
username;


  constructor(private api:BetappService) { 
    this.username = sessionStorage.getItem('username')
    this.getTransaction();
  }

  ngOnInit(): void {
    this.getinfouser();
    this.getaccount();
  	 this.input = {
      desc: 'Deposit of',
    };

     this.input_ = {
      desc: 'Withdrawal of',
    };
  }

depositValidate(x,y) {
  this.loading =true;
  this.money= {customer_name:this.username,amount: x, desc:this.input.desc+ ' ' + y}
  this.api.registerDeposit(this.money).subscribe(
  response => {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title:  ' Deposit has been done!',
      showConfirmButton: false,
      timer: 2000
    })
      
    },
    error => {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        showConfirmButton: false,
        timer: 2000
      })
      console.log(error)
      this.loading = false;
    }
    );
  }

  withdrawalValidate(a,b) {
      this.loading =true;
      this.money_= {customer_name:this.username,amount: -a, desc:this.input_.desc+ ' ' + b}
        this.api.registerWithdrawal(this.money_).subscribe(
        response => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title:  ' Withdrawal has been done!',
            showConfirmButton: false,
            timer: 2000
          })
          
        },
        error => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            showConfirmButton: false,
            timer: 2000
          })
          console.log(error)
          this.loading = false;
        }
        );
  }

getTransaction = () => {
    this.api.getUserTransaction(this.username).subscribe(
      data => {
        this.transactions =data;
      },
      error => {
        console.log(error)
      }
    )
  }



getaccount = () => {
    this.api.getUserAccount(this.username).subscribe(
      data => {
        if(data[0].balance_real.amount__sum == null){
          this.accounts = 0
        }else{
          this.accounts =data[0].balance_real.amount__sum;
        }
      },
      error => {
        console.log(error)
      }
    )
  }


getinfouser = () => {
    this.api.getOneUser(this.username).subscribe(
      data => {
        this.infos.username =data[0].username;
        this.infos.fullname =data[0].username;
        this.infos.phone =data[0].phone;
        this.infos.email =data[0].email;
      },
      error => {
        console.log(error)
      }
    )
  }



}

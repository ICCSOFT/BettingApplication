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
credit = [];
debit= [];
year: string;
month: string;
day: string;


  constructor(private api:BetappService) { 
    this.username = sessionStorage.getItem('username')
    this.getTransaction();
    this.year  = new Intl.DateTimeFormat('en', { year: 'numeric' }).format( Date.now())
    this.month = new Intl.DateTimeFormat('en', { month: 'short' }).format(Date.now())
    this.day   = new Intl.DateTimeFormat('en', { day: '2-digit' }).format( Date.now())


  }
  currentDate(currentDate: any): any {
    throw new Error('Method not implemented.');
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
    window.location.reload();
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
          window.location.reload();
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
        for(let x = 0; x < data.length; x++){
          if(Number(data[x].amount) < 0){
            this.debit.push(data[x].amount)
            this.credit.push("-")
          }else{
            this.debit.push("-")
            this.credit.push(data[x].amount)
          }

        }
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
        this.infos.fullname =data[0].fullname;
        this.infos.phone =data[0].phone;
        this.infos.email =data[0].email;
      },
      error => {
        console.log(error)
      }
    )
  }

  printToCart(printSectionId: string){
        let popupWinindow
        let innerContents = document.getElementById(printSectionId).innerHTML;
        popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" />\
        <style>\
              th{font-size: 18px;font-weight: bold;color: rgb(44, 90, 241);text-transform: uppercase;}\
              tr:nth-of-type(even){background: rgb(236, 235, 235); }\
              td{padding: 15px;text-align: left;vertical-align:middle;font-weight: 300px;height: 4px;font-size: 15px;color: rgb(13, 20, 34);border-bottom: solid 1px rgba(255,255,255,0.1);}\
        </style>\
        </head><body onload="window.print()">'
        + '<div class="card card-body">' 
        
        + '<h2 style="float:left; color: blue; margin-bottom: 40px;"">' + "Karmer Bet" +'</h2>'
        
        + '<div class="row">'

          + '<div class="col-5">'
            +   '<h4>' + "Account Owners Name: "+ this.infos.fullname + '</h4>' 
            +   '<h4>' + "Telephone Number: "+ this.infos.phone + '</h4>' 
            +   '<h4>' + "Transaction Details of "+ this.username + '</h4>'  
          + '</div>'

          + '<div class="col-3">'
            +    '<span>'+'<img src="assets/images/ybg.jpeg" style="height: 100px;width: 100px; border-radius: 70px;">'+'</span>' 
          + '</div>'

          + '<div class="col-4">'
            +   '<br><br><br><h5 style="float: right; display:flex">' + "printed date: "+ this.day + ' ' + this.month +','+ this.year + '</h2><br>' 
          + '</div>'

        + '</div>'
        + '<h2 style="text-align: center; color: blue; margin-top: 40px;">' + '<u>' + "Transaction Details" + '</u>' + '</h2>'

        + '<div>'        
          +'<hr style="height:2px;border-width:5px;color:gray;background-color:gray">'
          + innerContents 
        + '</div>'

        + '<div>'
          +'<footer style="color:white;background-color:black">'
          + '<br><p style="text-align: center">'+ "Contact Us on this Email"+ '&nbsp;&nbsp;&nbsp;&nbsp;' + "Kamerbet@gmail.fr"+ '&nbsp;&nbsp;&nbsp;'+ "Fax: 555 654 222" + '</p><br>'
          +'</footer>'
        + '</div>'

        + '</html>');
        popupWinindow.document.close();
  }


}

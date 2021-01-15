import { Component, OnInit } from '@angular/core';
import { BetappService } from '../betapp.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [BetappService]
})
export class HelpComponent implements OnInit {
  loading = false;
  data;

  constructor(private api:BetappService,
              private router: Router ) { }

  ngOnInit(): void {
  }

  sendMail(x,y) {
  	this.loading = true;
  	this.data = {'Expéditeur':x , 'Message': y}
  	this.api.mailsending(this.data).subscribe(
        response => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title:  'Your request has been well sent !',
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
        );}
  }

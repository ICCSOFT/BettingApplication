import { Component, OnInit } from '@angular/core';
import { BetappService } from '../betapp.service';

@Component({
  selector: 'app-betslip',
  templateUrl: './betslip.component.html',
  styleUrls: ['./betslip.component.css']
})
export class BetslipComponent implements OnInit {
  orders;
  Array: any[] = [];
  status: any[] = [];
  list: (item: any) => void;
  actor;
 play;

  constructor(private api: BetappService) { 
    this.getOrder();
   }

  ngOnInit(): void {
    this.play = "Ongoing"

    this.list = (item) =>{
    this.Array = item;
    for(let x =0; x< item.match.length; x++){
      this.status.push('loss');
    }
    
      if(this.status.includes('ongoing') == true){
        this.play = "ongoing"
      }else if(this.status.includes('loss') == true){
        this.play = "loss"
      }else{
        this.play = "won"
      }
    }    
  }

  getOrder = () => {
    this.api.getOneOrder(sessionStorage.getItem('username')).subscribe(
      data => {
        this.orders =data;
      },
      error => {
        console.log(error)
      }
    )
  }

  

}

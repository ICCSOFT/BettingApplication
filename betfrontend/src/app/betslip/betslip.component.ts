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
  mystatus: any[] = [];
  paidlist: any[] = [];
 conf = []
  element: any[] = [];
  elems;
  cart = [];
  actor;
  play: any[] = [];
  // play;
  plays;
  money_: { customer_name: string; amount: number; desc: string; };
  property;
  scores;
  side: any;
  home_score;
  away_score;

  constructor(private api: BetappService) { 
    this.getOrder();
    this.getScores();
   }

  ngOnInit(): void {
    
  }


  list = (item) =>{
    this.Array = item;

    for(let stat of this.scores){

      if(stat.time.substring(0, 2) >= 85 && stat.finish == true){
        
        this.mystatus.push(stat.match_name)
      }      
      this.cart.push({key: stat.match_name, value: [stat.home_score , stat.away_score]});      
    }
    let status: any[] = [];
    for(let mats of item.match){
      
      if(this.mystatus.includes(mats.key) == true){
        for (let i = 0; i < this.cart.length; i++){   
          if(this.cart[i].key == mats.key){ 
          this.element = this.cart[i].value
         }
        }
        this.home_score = this.element[0]
        this.away_score = this.element[1]
        this.side = mats.value.split(" -")[1]
        
        if(this.side == 1 && this.home_score > this.away_score){
          status.push("won")
          
        }else if(this.side == 2 && this.home_score < this.away_score){
          status.push("won")

        }else if(this.side == 'X' && this.home_score == this.away_score){
          status.push("won")
        }else{
          status.push("loss")
        }
      }else{
        status.push("ongoing")
      }
      this.elems=status
    }
        if(item.finished == true){
          for (let i = 0; i < this.orders.length; i++){  
            if(this.conf[i].key == item.date_ordered){ 
              this.conf[i].value = "Paid Out"
           }
          }
        }else{
          if(this.elems.includes('ongoing') == true){
            for (let i = 0; i < this.orders.length; i++){  
              if(this.conf[i].key == item.date_ordered){ 
                this.conf[i].value = "Ongoing"
             }
            }
          }else if(this.elems.includes('loss') == true){
            for (let i = 0; i < this.orders.length; i++){  
              if(this.conf[i].key == item.date_ordered){ 
                this.conf[i].value = "loss"
             }
            }
          }else{
            this.property={id:item.id,username:sessionStorage.getItem('username'), match:item.match, odd:item.odd,stake_amount:item.stake_amount, possible_winning:item.possible_winning}  
            this.api.setOneOrder(this.property).subscribe();
            for (let i = 0; i < this.orders.length; i++){  
              if(this.conf[i].key == item.date_ordered){ 
                this.conf[i].value = "won"
             }
            }
            this.money_= {customer_name:sessionStorage.getItem('username'),amount: item.possible_winning, desc:'Won bet'}
            this.api.registerDeposit(this.money_).subscribe();  
          
            }
        }
        // console.log(this.play)
      
    
    }    

  getOrder = () => {
    this.api.getOneOrder(sessionStorage.getItem('username')).subscribe(
      data => {
        this.orders =data;
        for (let order of this.orders){   
          this.conf.push({key: order.date_ordered, value: ""});
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  getScores = () => {
    this.api.getAllScores().subscribe(
      data => {
        this.scores =data;
      },
      error => {
        console.log(error)
      }
    )
  }

  

}

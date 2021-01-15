import { Component, OnInit } from '@angular/core';
import { BetappService } from '../betapp.service';



@Component({
  selector: 'app-betslip',
  templateUrl: './betslip.component.html',
  styleUrls: ['./betslip.component.css']
})
export class BetslipComponent implements OnInit {
  money_: { customer_name: string; amount: number; desc: string; };
  orders;
  cart     = [];
  Array    = [];
  mystatus = [];
  conf     = []
  element  = [];
  elems;

  property;
  scores;
  side;
  username;
  home_score;
  away_score;
  users;
  betlists;
  selectedUser;
  selectedBet;

  constructor(private api: BetappService) { 
    this.username = sessionStorage.getItem('username')
    this.getOrder();
    this.getScores();
    this.getAllUsers();
    this.getAllOrders();
    
    this.selectedUser = {id:-1, is_active:true};
    this.selectedBet = {id:-1, cancelled:false};
   }

  ngOnInit(): void {
  }

  getAllUsers = () => {
    this.api.getAllUsers().subscribe(
      data => {
        this.users =data;
      },
      error => {
        console.log(error)
      }
    )
  }

  getAllOrders = () => {
    this.api.getAllOrder().subscribe(
      data => {
        this.betlists =data;
        
      },
      error => {
        console.log(error)
      }
    )
  }

  userrole = () => {
    if(sessionStorage.getItem('role') === 'true' && this.username)
    return true
  }

  list = (item) =>{
    this.Array = item;

    for(let stat of this.scores){

      if(stat.time.substring(0, 2) >= 90 && stat.finish == true){
        
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
    }    

  getOrder = () => {
    this.api.getOneOrder(this.username).subscribe(
      data1 => {
        this.orders =data1;
        for (let order of this.orders){   
          this.conf.push({key: order.date_ordered, value: ""});
        }

        this.api.getAllScores().subscribe(
          data2 => {
            this.scores =data2;

              for(let item of this.orders){
                this.Array = item
          
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
                  if(item.cancelled == true){
                    for (let i = 0; i < this.orders.length; i++){  
                      if(this.conf[i].key == item.date_ordered){ 
                        this.conf[i].value = "Cancelled"
                     }
                    }
                  }else if(item.finished == true){
                    for (let i = 0; i < this.orders.length; i++){  
                      if(this.conf[i].key == item.date_ordered){ 
                        this.conf[i].value = "Paid Out"
                        console.log(this.conf)
                     }
                    }
                  }else{
                    if(this.elems.includes('ongoing') == true){
                      for (let i = 0; i < this.orders.length; i++){  
                        if(this.conf[i].key == item.date_ordered){ 
                          this.conf[i].value = "ongoing"
                       }
                      }
                    }else if(this.elems.includes('loss') == true){
                      for (let i = 0; i < this.orders.length; i++){  
                        if(this.conf[i].key == item.date_ordered){ 
                          this.conf[i].value = "loss"
                       }
                      }
                    }else{
                      this.property={id:item.id,username:this.username, match:item.match, odd:item.odd,stake_amount:item.stake_amount, possible_winning:item.possible_winning}  
                      this.api.setOneOrder(this.property).subscribe();
                      for (let i = 0; i < this.orders.length; i++){  
                        if(this.conf[i].key == item.date_ordered){ 
                          this.conf[i].value = "won"
                       }
                      }
                      this.money_= {customer_name:this.username,amount: item.possible_winning, desc:'Won bet'}
                      this.api.registerDeposit(this.money_).subscribe();          
                    }
                  }
              }  
          
          },
          error => {
            console.log(error)
          }
        )
        
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

  getinfouser = (id) => {
    this.api.getOneUser(id).subscribe(
      data => {
        this.selectedUser.id = data[0].id;
        this.selectedUser.is_active = data[0].is_active;
        
      },
      error => {
        console.log(error)
      }
    )
  }

  getinfoorder = (id) => {
    this.api.getOneBet(id).subscribe(
      data => {
        this.selectedBet.id = data.id ;
        this.selectedBet.cancelled = data.cancelled;
        
      },
      error => {
        console.log(error)
      }
    )
  }

  updateUser = () => {
    this.api.updateUser(this.selectedUser).subscribe(
      data => {
        this.getAllUsers();
      },

      error => {
        console.log(error);
      }
    )
  }

  updateBet = () => {
    this.api.updateBet(this.selectedBet).subscribe(
      data => {
        this.getAllOrders();
      },

      error => {
        console.log(error);
      }
    )
  }

  deleteUser = (x) => {
    this.api.deleteUser(x).subscribe(
      data => {
        this.getAllUsers();
      },

      error => {
        console.log(error);
      }
    )
  }

  deleteBet = (x) => {
    this.api.deleteOrder(x).subscribe(
      data => {
        this.getAllOrders();
      },

      error => {
        console.log(error);
      }
    )
  }

}

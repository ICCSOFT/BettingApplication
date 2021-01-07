import { Component, OnInit } from '@angular/core';
import { BetappService } from '../betapp.service';
import * as $ from 'jquery'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-matches',
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css'],
  providers: [BetappService]
})
export class MatchesComponent implements OnInit {
  currentDate: number = Date.now();
  cote;
  items;
  iden;
  day;
  month;
  year;
  total;
  matches;
  balance;
  selectedMatch;
  selectedGames;
  money_: { customer_name: string; amount: number; desc: string; };
  username: string;
  
  constructor(private api: BetappService) {
    this.username = sessionStorage.getItem('username')
    this.selectedMatch = {id:-1, match_name:'', home_code:'', draw_code:'', away_code:''};
    this.year  = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.currentDate)
    this.month = new Intl.DateTimeFormat('en', { month: 'long' }).format(this.currentDate)
    this.day   = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.currentDate)
    this.getMatches();
    
  }


  ngOnInit(){
    this.moneyControl();
    this.items = this.getItem();
    window.onload = function() {
    document.querySelectorAll("INPUT[type='radio']").forEach(function(rd) {
      rd.addEventListener("mousedown", function() {
        if(this.checked) {
          this.onclick=function() {
            this.checked=false
          }
        } else {
          this.onclick=null
        }
        })
      })
    }
  }

  getMatches = () => {
    this.api.getAllMatches().subscribe(
      data => {
        this.matches =data;
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

  deleteMatch = (match) => {
    this.api.deleteMatch(match).subscribe(
      data => {
        this.getMatches();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Match Deleted',
          showConfirmButton: false,
          timer: 2000
        })
      },
      error => {
        console.log(error);
      }
    )
  }

  clickMatch = (match, nbre) => {    
    this.cote = nbre
    this.iden = match.match_name;
    localStorage.setItem(this.iden, this.cote)
    var dict = [];
    for (let i = 0; i < localStorage.length; i++){       
        let key = localStorage.key(i);
        dict.push({
            key:key,
            value: localStorage.getItem(key)
        });
    }
    this.items = dict;
    let i=1;
        for (let item of dict){
          
          i *= item.value.split(' ')[0]
        }
        this.total = i

    this.api.getOneMatch(match.id).subscribe(
      data => {
        this.selectedMatch = data;
      },
      error => {
        console.log(error);
      }
    )
  }

  removeMatch = (it) => { 
    let key = localStorage.key(it);
    localStorage.removeItem(key)

    var dict = [];
    for (let i = 0; i < localStorage.length; i++){       
        let key = localStorage.key(i);
        dict.push({
            key:key,
            value: localStorage.getItem(key)
        });
    }
    this.items = dict;
    let i=1;
        for (let item of dict){
          
          i *= item.value.split(' ')[0]
        }
        this.total = i
  }

  getItem = () =>{
    var dict = [];
      for (let i = 0; i < localStorage.length; i++){ 
          let key = localStorage.key(i);
          dict.push({
              key:key,
              value: localStorage.getItem(key)
          });
      }
      let i=1;
          for (let item of dict){
            
            i *= item.value.split(' ')[0]
          }
          this.total = i
      return dict
  }

  moneyControl = () => {
    $("input[data-type='currency']").on({
      keyup: function() {
        formatCurrency($(this),"keyup");
      },
      blur: function() { 
        formatCurrency($(this), "blur");
      }
  });
  
  
    function formatNumber(n) {
      // format number 1000000 to 1,234,567
      return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "")
    }
  
  
    function formatCurrency(input, blur) {
      // appends $ to value, validates decimal side
      // and puts cursor back in right position.
      
      // get input value
      var input_val = input.val();
      
      // don't validate empty input
      if (input_val === "") { return; }
      
      // original length
      var original_len = input_val.length;
    
      // initial caret position 
      var caret_pos = input.prop("selectionStart");
        
      // check for decimal
      if (input_val.indexOf(".") >= 0) {
    
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");
    
        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
    
        // add commas to left side of number
        left_side = formatNumber(left_side);
    
        // validate right side
        right_side = formatNumber(right_side);
        
        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
          right_side += "00";
        }
        
        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);
    
        // join number by .
        input_val = left_side + "." + right_side;
    
      } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = input_val;
        
        // final formatting
        if (blur === "blur") {
          input_val += ".00";
        }
      }
      
      // send updated string to input
      input.val(input_val);
    
      // put caret back in the right position
      var updated_len = input_val.length;
      caret_pos = updated_len - original_len + caret_pos;
      input[0].setSelectionRange(caret_pos, caret_pos);
    }
  
  }

  clearList = () => {
    localStorage.clear()
    var dict = [];
        for (let i = 0; i < localStorage.length; i++){ 
            let key = localStorage.key(i);
            dict.push({
                key:key,
                value: localStorage.getItem(key)
            });
        }
        this.items = dict;
        let i=1;
            for (let item of dict){
              
              i *= item.value.split(' ')[0]
            }
            this.total = i
        return dict
  }

  placeBet = (x) => {
    this.api.getUserAccount(this.username).subscribe(
      data => {
        if(data[0].balance_real.amount__sum-10 <= x){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Account balance is below amount staked',
            showConfirmButton: false,
            timer: 2000
          })
        }else if(x<=100){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Minimum Amount to Stake is 100FCFA',
            showConfirmButton: false,
            timer: 2000
          })
        }else if(x>= 100000){
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Maximum Amount to Stake is 100,000FCFA',
            showConfirmButton: false,
            timer: 2000
          })
        }else{
          this.selectedGames = {customer_name:this.username, match:this.items, odd:this.total,
                              stake_amount:x, possible_winning:x*this.total}  
          
          this.money_= {customer_name:this.username,amount: -x, desc:'Place bet'}
          this.api.registerWithdrawal(this.money_).subscribe();           
          this.api.placeBet(this.selectedGames).subscribe(
            data => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Your bet have been saved',
                showConfirmButton: false,
                timer: 2000
              })
          },
            error => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Please Log in to place bet',
                showConfirmButton: false,
                timer: 2000
              })
              console.log(error);
            }
          );
          (<HTMLInputElement>document.getElementById("currency-field")).value='';
          this.clearList()
        }
      }
    )
  }

}
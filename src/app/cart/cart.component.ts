import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  public products:any=[];
  public grandTotal !:number;
  constructor(private auth:AuthService){}
  ngOnInit(): void {
    this.auth.canAccess();
    this.auth.getProducts()
    .subscribe(res=>{
      this.products =res;
      this.grandTotal=this.auth.getTotalPrice();
    })
  }
  removeItem(item:any){
    this.auth.removeCartItem(item)
  }
  emptyCart(){
    this.auth.removeAllCart();
  }
}

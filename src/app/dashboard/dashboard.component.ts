import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { FilterPipe } from '../shared/filter.pipe';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public productList: any; // store getting all the value..
  public searchKey: string = "";
  public filterCategory: any
  constructor(private auth: AuthService) { }
  ngOnInit(): void {
    this.auth.canAccess();
    this.auth.getProduct()
      .subscribe(res => {
        this.productList = res;
        this.filterCategory = res;
        this.productList.forEach((a: any) => {
          if (a.category === "women's clothing" || a.category === "men's clothing") {
            a.category = "fashion"
          }
          //object.assign -> add quantity and price add to cart page && combine to objects
          Object.assign(a, { quantity: 1, total: a.price });

        });
      })
    //this.auth.search -> as a behaviour subject as using subscribe to emits the data ...
    this.auth.search.subscribe((val: any) => {
      this.searchKey = val;
    })
  }
  addToCart(item: any): void {
    this.auth.addToCart(item);
    console.log(item);
  }
  filter(category: string) {
    this.filterCategory = this.productList
      .filter((a: any) => {
        if (a.category === category || category === '') {
          return a;
        }
      })
  }
}

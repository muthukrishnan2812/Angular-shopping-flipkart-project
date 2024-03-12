import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
public totalItem:number=0
public searchTerm !:string;
  constructor(public auth:AuthService){}
  ngOnInit(): void {
    this.auth.getProducts()
    .subscribe(res=>{
      this.totalItem = res.length;
    })
  }
  logout(){
    this.auth.removeToken();
    this.auth.canAccess();
  }
  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.auth.search.next(this.searchTerm);
    
  }

}

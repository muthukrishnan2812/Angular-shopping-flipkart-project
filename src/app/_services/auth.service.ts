import { HttpClient } from '@angular/common/http';
import { Inject, Injectable,PLATFORM_ID, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public cartItemList: any[] = [];
  public productList = new BehaviorSubject<any>([]);
  public search = new BehaviorSubject<string>("");

  constructor(private router: Router, private http: HttpClient,@Inject(PLATFORM_ID) private platformId:Object) { }

  isAuthenticated(): boolean {
    // Ensure the code only accesses sessionStorage when running in the browser
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('token') !== null;
    }
    // Return false by default if the code runs on the server
    return false;
  }
  canAccess() {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'])
    }
  }
  canAuthenticate() {
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard'])
    }
  }
  register(name: string, email: string, password: string) {
    return this.http.post<{ idToken: string }>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAMphxc7uPZfpdIHaPR8Npi2kibIaIPN-E
    `, { displayName: name, email: email, password: password });
  }
  storeToken(token: any) {
    sessionStorage.setItem('token', token)
  }
  login(email: string, password: string) {
    return this.http.post<{ idToken: String }>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAMphxc7uPZfpdIHaPR8Npi2kibIaIPN-E
    `, { email: email, password: password });
  }
  removeToken() {
    sessionStorage.removeItem('token');
  }
  getProduct() {
    return this.http.get(`https://fakestoreapi.com/products/`)
      .pipe(map(res => {
        return res
      }))
  }
  getProducts(){
    return this.productList.asObservable();
  }
  setProduct(product: any) {
    this.cartItemList.push(...product)
    this.productList.next(product)
  }
  addToCart(product: any): void {
    this.cartItemList.push(product);
    this.productList.next(this.cartItemList)
    this.getTotalPrice();
    console.log(this.cartItemList);
  }
  getTotalPrice():number {
    let grandTotal = 0;
    this.cartItemList.map((a: any) => {
      grandTotal += a.total;
    })
    return grandTotal;
  }
  removeAllCart() {
    this.cartItemList = []
    this.productList.next(this.cartItemList)
  }
  removeCartItem(product: any) {
    this.cartItemList.map((a: any, index: any) => {
      if (product.id == a.id) {
        this.cartItemList.splice(index, 1);
      }
    })
    this.productList.next(this.cartItemList);
  }
}

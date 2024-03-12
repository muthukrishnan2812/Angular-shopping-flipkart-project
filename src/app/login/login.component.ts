import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
formdata={email:"",password:""}
constructor( private auth: AuthService){
}
ngOnInit(): void {
  this.auth.canAuthenticate()
}
  onSubmit(){
    console.log(this.formdata);
    this.auth.login(this.formdata.email,this.formdata.password)
    .subscribe({
      next:data=>{
        this.auth.storeToken(data.idToken);
        console.log(data.idToken);
        this.auth.canAuthenticate();
      }
    })
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  formdata={name:"",email:"",password:""}
  constructor(private auth:AuthService){
  }
  ngOnInit(): void {
    this.auth.canAuthenticate();
  }
  onSubmit(){
    this.auth.register(this.formdata.name,this.formdata.email,this.formdata.password)
    .subscribe({
      next:data=>{
        this.auth.storeToken(data.idToken);
        console.log(data.idToken);
        this.auth.canAuthenticate();
        alert('user registered successfully');
      },
      error: err => {
        console.error('Registration failed:', err);
        // Handle error here, e.g., display an error message to the user
      }
    })
  }
}

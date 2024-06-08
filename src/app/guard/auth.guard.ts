import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state:RouterStateSnapshot) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  if (auth.isAuthenticated()) {
    console.log('user autheticated');
    return true;
  }
  else {
    router.navigate(['login'])
    return false;
  }
};

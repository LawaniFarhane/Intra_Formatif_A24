import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user';

export const preferCatGuard: CanActivateFn = (route, state) => {
  if(!inject(UserService).isLogged()){
    return createUrlTreeFromSnapshot(route,["/login"]);
  }

  if(!inject(UserService).currentUser?.prefercat){
    return createUrlTreeFromSnapshot(route,["/dog"]);
  }
  
  return true;

  
};

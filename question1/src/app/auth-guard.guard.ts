import { inject } from "@angular/core";
import { CanActivateFn, createUrlTreeFromSnapshot  } from '@angular/router';
import { UserService } from './user.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  if (!inject(UserService).isLogged()) {
    return createUrlTreeFromSnapshot(route, ['/login']);
  }
  return true;
};

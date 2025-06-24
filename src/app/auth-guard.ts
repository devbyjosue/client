import { Injectable, signal } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router   } from '@angular/router';
import { RoleService } from './services/role.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private roleService: RoleService
) {}

canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  return this.authService.getAuthUser().pipe(
    switchMap(vBadge => {
      if (!vBadge) return of(false);

      return this.userService.getUserByvBadge(vBadge.vBadge).pipe(
        switchMap(user => {
          return this.roleService.getRoles().pipe(
            map(roles => {
              // console.log(v/Badge)
              // @ts-ignore
              const userRole = roles.find(r => r.id === user.roleId)?.name;
              // console.log(userRole)
              const allowedRoles = route.data['roles'] as string[];
              const isAuthorized = allowedRoles.includes(userRole ?? '');
              if (!isAuthorized) this.router.navigate(['/unauthorized']);
              return isAuthorized;
            })
          );
        })
      );
    })
  );
}


  // canViewuser(): boolean {
  //   this.canActivate();

  //   if (this.userAuthRole() == null || this.userAuthRole()== '') {
  //     return false
  //   }
  //   if (this.userAuthRole() === "user") {
  //     return true
  //   }
  //   return false
    
  // }
}

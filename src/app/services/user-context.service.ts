import { Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {

  userAuthName = signal("" as string | null);
  userAuthRole = signal("" as string | null);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService

  ) { }

  refresh(): void {
    console.log("Refreshing user context");
    this.authService.getAuthUser().subscribe(vBadge => {
      if (!vBadge) return;

      this.userService.getUserByvBadge(vBadge.vBadge).subscribe(user => {
        this.userAuthName.set(user.name);

        this.roleService.getRoles().subscribe(roles => {
          
              // @ts-ignore
          const role = roles.find(r => r.id === user.roleId);
          this.userAuthRole.set(role?.name ?? null);
        });
      });
    });
  }

}

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { capitalize } from '../../../utils/capitalize';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

   headerTitle = signal("" as string | null);
   userAuthName = signal("" as string | null);
   userAuthRole = signal("" as string | null);

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    public userContext: UserContextService,
    private userService: UserService,
    private authService: AuthService,
    private roleService: RoleService
    
  ) {}
  

  ngOnInit(): void {

      this.userAuthName.set(this.userContext.userAuthName());
      this.userAuthRole.set(this.userContext.userAuthRole());

      console.log(this.userAuthName());
      console.log(this.userAuthRole());

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentUrl = this.router.url;
        const urlSegments = currentUrl.split('/');
        const lastSegment = urlSegments[urlSegments.length - 1];
        this.headerTitle.set(capitalize(lastSegment));
    });

    // this.authService.getAuthUser().subscribe(vBadge => {
    //   console.log(vBadge);
    //   if (vBadge === null) {
    //     // this.userAuthName.set("Josue");
    //     // this.userAuthRole.set("User");
    //     return;
    //   } 
    //   // console.log(vBadge);
    //   this.userService.getUserByvBadge(vBadge.vBadge).subscribe(user => {
    //     // console.log(user);
    //     // this.userAuthName.set(user.name);
    //     this.roleService.getRoles().subscribe(roles => {
    //       // @ts-ignore
    //       const role = roles.filter(role => role.id === user.roleId)[0];
    //       // this.userAuthRole.set(role.name);
    //     });
    //   });
    // });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const lastSegment = this.router.url.split('/').pop();
        this.headerTitle.set(capitalize(lastSegment ?? ''));
      });

    this.userContext.refresh();

  }

 

  navigateTo(route: string): void {
    console.log("Navigating to:", route);
    this.router.navigate([route], { relativeTo: this.route });
  
  }
}

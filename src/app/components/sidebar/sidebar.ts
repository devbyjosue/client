import { Component, EventEmitter, inject, Input, input, OnInit, Output, signal } from '@angular/core';
import { NavSection } from "../nav-section/nav-section";
import { NavSubSection } from "../nav-sub-section/nav-sub-section";
import { AuthGuard } from 'src/app/auth-guard';
import { MenuService } from 'src/app/services/menu.service';
import { UserContextService } from 'src/app/services/user-context.service';
import { RoleService } from 'src/app/services/role.service';
import { forkJoin } from 'rxjs';

export type SidebarLink = {
  name?: string;
  link?: string;
  subLinks?: SidebarLink[];
  data?: any;
}

@Component({
  selector: 'app-sidebar',
  imports: [NavSection],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {
  @Output() toggleEvent = new EventEmitter<boolean>();

  userRole = signal("" as string | null);
  userRoleId = signal(null as number | null);
  private authGuard = inject(AuthGuard);
  isAuthenticated = signal(true);//signal(this.authGuard.canActivate());

  sidebarLinks = signal([] as any[]);
  menus = signal([] as any[]);
  menuRoles = signal([] as any[]);
  

  constructor(private menuService: MenuService,
    private userContext: UserContextService,
    private roleService: RoleService
  ) { }

  ngOnInit(): void {
    
      const roleName = this.userContext.userAuthRole();
  this.userRole.set(roleName);

  this.roleService.getRoleByName(roleName!).subscribe(role => {
    if (!role?.id) return;
    this.userRoleId.set(role.id);

    forkJoin([
      this.menuService.getMenuRoles(),
      this.menuService.getMenus()
    ]).subscribe(([menuRoles, menus]) => {
      this.menuRoles.set(menuRoles);
      this.menus.set(menus);
      this.getMenus(menus, menuRoles, role.id);  
    });
  });
   
  }

getMenus(menus: any, menuRoles: any, roleId: any) {

    


   this.menuService.getMenuRoles().subscribe(mr => {
      this.menuRoles.set(mr);
    });
    this.menuService.getMenus().subscribe(apiMenus => {
    const formattedMenus = apiMenus.map((menu: any) => ({
      name: menu.name,
      link: `/${menu.name}`
    }));

    this.menus.set(formattedMenus);


    const adminMenuRolesAllowed = this.menuRoles().filter((menu: any) =>
      [6, 7, 8, 9].includes(menu.menuId) &&
      menu.roleId === this.userRoleId() &&
      menu.canView === true
    )
    // .map(mr => mr.name);

    const userMenuRolesAllowed = this.menuRoles().filter((menu: any) =>
      [5].includes(menu.menuId) &&
      menu.roleId === this.userRoleId() &&
      menu.canView === true
    )
    // .map(mr => mr.name);

    const tiMenuRolesAllowed = this.menuRoles().filter((menu: any) =>
      [1,3,4].includes(menu.menuId) &&
      menu.roleId === this.userRoleId() &&
      menu.canView === true
    )
    // .map(mr => mr.name);

    
    // console.log(adminMenuRolesAllowed,userMenuRolesAllowed,tiMenuRolesAllowed)
    

  
    const adminMenus = formattedMenus.filter((menu: any) =>
      ["Users", "Roles", "Menus", "MenuRoles"].includes(menu.name)
    );

    if (adminMenuRolesAllowed.length >= 4) {
      this.sidebarLinks.set( [
        ...this.sidebarLinks(), {
        name: "TI-Config",
        link: "/TI-Config",
        subLinks: adminMenus,
      }
      ])
    };
    // const adminMenusData = {
    //   ...adminMenus,
    //   data: { roles: adminMenuRolesAllowed }
    // }

    // console.log(adminMenuRolesAllowed)
    const userMenus = formattedMenus.filter((menu: any) =>
      menu.name === "Sales" 
    );

    if (userMenuRolesAllowed.length != 0) {
      const userMenusLinks = {
        name: "Sales",
        link: "/Sales",
        subLinks: userMenus
      }
      this.sidebarLinks.set([...this.sidebarLinks(), userMenusLinks])
    };

    const tiDevMenus = formattedMenus.filter((menu: any) =>
      menu.name === "Configuration" || menu.name === "Testing" || menu.name === "IT" 
    );

     if (tiMenuRolesAllowed.length >= 3) {
      this.sidebarLinks.set([
        ...this.sidebarLinks(),
        {
          name: "Admin Secrets",
          link: "/admin-secrets",
          subLinks: tiDevMenus,
        }
      ]
      )
    };

    // console.log(this.sidebarLinks())

    // this.sidebarLinks.set([
     
    // ]);

    //  {
    //     name: "Configuration",
    //     link: "/configuration",
    //     subLinks: adminMenus,
      // },
      // {
      //   name: "Sales",
      //   link: "/Sales",
      //   subLinks: userMenus
      // },
      // {
      //   name: "TI Dev",
      //   link: "/TI-Dev",
      //   subLinks: tiDevMenus,
      // }
  });
}


  

  

  toggleSidebar(){
    this.toggleEvent.emit(false);
  }
}


// [
//     {
//       name: "Configuration",
//       link: "/configuration",
//       subLinks : [
//         {
//           name: "User",
//           link: "/configuration/users"
//         },
//         {
//           name: "Roles",
//           link: "/configuration/roles"
//         },
        
//         {
//           name: "Menu",
//           link: "/configuration/menus"
//         },
//         {
//           name: "MenuRoles",
//           link: "/configuration/menu-roles"
//         }
//       ]
//     },
//     {
//       name: "Administration",
//       link: "/admin",
//       subLinks : [
//         {
//           name: "Sales",
//           link: "/admin/sales"
//         }
//       ]
//     }
//   ]

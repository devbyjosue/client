import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { NavSection } from "../nav-section/nav-section";
import { NavSubSection } from "../nav-sub-section/nav-sub-section";

export type SidebarLink = {
  name?: string;
  link?: string;
  subLinks?: SidebarLink[];
}

@Component({
  selector: 'app-sidebar',
  imports: [NavSection],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Output() toggleEvent = new EventEmitter<boolean>();

  sidebarLinks = [
    {
      name: "Configuration",
      link: "/configuration",
      subLinks : [
        {
          name: "User",
          link: "/configuration/users"
        },
        {
          name: "Roles",
          link: "/configuration/roles"
        }
      ]
    },
    {
      name: "Administration",
      link: "/admin",
      subLinks : [
        {
          name: "Sales",
          link: "/admin/sales"
        }
      ]
    }
  ]

  toggleSidebar(){
    this.toggleEvent.emit(false);
  }
}

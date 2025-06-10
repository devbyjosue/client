import { Component, Input } from '@angular/core';
import { SidebarLink } from '../sidebar/sidebar';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav-sub-section',
  imports: [RouterLink, RouterModule],
  templateUrl: './nav-sub-section.html',
  styleUrl: './nav-sub-section.css'
})
export class NavSubSection {
  @Input() route: string | undefined = "";
  @Input() name: string | undefined = "";

  constructor(private router: Router){}

  handleNavigation(){
    this.router.navigate([this.route]);
  }

}

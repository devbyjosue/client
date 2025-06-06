import { Component, Input, signal } from '@angular/core';
import { NavSubSection } from "../nav-sub-section/nav-sub-section";
import { SidebarLink } from '../sidebar/sidebar';

@Component({
  selector: 'app-nav-section',
  imports: [
    NavSubSection
  ],
  templateUrl: './nav-section.html',
  styleUrl: './nav-section.css'
})
export class NavSection {
  isNavSectionOpen = signal(false);
  @Input() sectionData: SidebarLink = {};

  toggleNavSection(command: boolean){
    this.isNavSectionOpen.set(command);
  }
}
